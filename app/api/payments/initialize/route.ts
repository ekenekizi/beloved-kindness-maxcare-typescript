import { donationCauses } from "@/features/get-involved/data/donation-options";
import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";
import { inspectCheckoutRetry } from "@/lib/payments/inspect-checkout-retry";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please send valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "Invalid donation details." },
      { status: 400 },
    );
  }

  const { name, email, amount, cause, requestId } = body as Record<
    string,
    unknown
  >;

  if (
    name != null &&
    (typeof name !== "string" ||
      name.trim().length > 120 ||
      /[\u0000-\u001f\u007f]/.test(name))
  ) {
    return Response.json(
      { error: "Please enter a valid name under 120 characters." },
      { status: 400 },
    );
  }

  const donorName = typeof name === "string" ? name.trim() || null : null;

  if (
    typeof requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  ) {
    return Response.json(
      { error: "A valid checkout request ID is required." },
      { status: 400 },
    );
  }

  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // For this endpoint, the browser sends the amount in naira.
  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !/^\d+(\.\d{1,2})?$/.test(String(amount))
  ) {
    return Response.json(
      { error: "Enter a positive amount with up to two decimal places." },
      { status: 400 },
    );
  }

  const amountInKobo = Math.round(amount * 100);

  if (!Number.isSafeInteger(amountInKobo)) {
    return Response.json(
      { error: "The donation amount is too large." },
      { status: 400 },
    );
  }

  const selectedCause = donationCauses.find((option) => option.value === cause);

  if (!selectedCause) {
    return Response.json(
      { error: "Please select a valid donation cause." },
      { status: 400 },
    );
  }

  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const appUrl = process.env.APP_URL;

    // Keep this learning stage restricted to simulated payments.
    if (!secretKey?.startsWith("sk_test_") || !appUrl) {
      return Response.json(
        { error: "Test payment configuration is missing or invalid." },
        { status: 503 },
      );
    }

    const callbackUrl = new URL("/get-involved/donate", appUrl).toString();
    const sql = getSql();

    const reference = `BKM-${randomUUID()}`;

    let [donation] = await sql`
  INSERT INTO donations (
    reference,
    donor_name,
    donor_email,
    amount_in_kobo,
    currency,
    cause,
    checkout_request_id
  )
  VALUES (
    ${reference},
    ${donorName},
    ${email.trim()},
    ${amountInKobo},
    'NGN',
    ${selectedCause.value},
    ${requestId}
  )
  ON CONFLICT (checkout_request_id) DO NOTHING
  RETURNING reference, status
`;

    if (!donation) {
      // Another request already created this checkout attempt.
      const [existingDonation] = await sql`
  SELECT
    reference,
    donor_name,
    donor_email,
    amount_in_kobo,
    currency,
    cause,
    status,
    checkout_url
  FROM donations
  WHERE checkout_request_id = ${requestId}
  LIMIT 1
`;

      if (!existingDonation) {
        throw new Error("Checkout attempt could not be found.");
      }

      // A request ID cannot be reused for different donation details.
      const detailsMatch =
        existingDonation.donor_name === donorName &&
        existingDonation.donor_email === email.trim() &&
        String(existingDonation.amount_in_kobo) === String(amountInKobo) &&
        existingDonation.currency === "NGN" &&
        existingDonation.cause === selectedCause.value;

      if (!detailsMatch) {
        return Response.json(
          { error: "This request ID belongs to different donation details." },
          { status: 409 },
        );
      }

      const retryResponse = await inspectCheckoutRetry(
        existingDonation.reference,
      );

      if (retryResponse) {
        return retryResponse;
      }

      // A null result means initialization never started.
      // Continue using this existing record and its original reference.
      donation = existingDonation;
    }

    const attemptToken = randomUUID();

    const [claimedDonation] = await sql`
  UPDATE donations
  SET
    checkout_state = 'initializing',
    checkout_started_at = NOW(),
    checkout_attempt_token = ${attemptToken}
  WHERE reference = ${donation.reference}
    AND status = 'pending'
    AND checkout_state = 'created'
    AND checkout_url IS NULL
  RETURNING reference
`;

    if (!claimedDonation) {
      return Response.json(
        {
          error:
            "This checkout is already being handled. Please retry shortly.",
          code: "CHECKOUT_NOT_READY",
          reference: donation.reference,
        },
        { status: 409 },
      );
    }

    let checkoutSaved = false;

    try {
      const cancelUrl = new URL("/get-involved/donate", appUrl);

      cancelUrl.searchParams.set("reference", donation.reference);
      cancelUrl.searchParams.set("cancelled", "1");

      const paystackResponse = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            amount: amountInKobo,
            currency: "NGN",
            reference: donation.reference,
            callback_url: callbackUrl,
            metadata: {
              cause: selectedCause.value,
              cancel_action: cancelUrl.toString(),
            },
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        },
      );

      const result = await paystackResponse.json();

      if (
        !paystackResponse.ok ||
        result?.status !== true ||
        result?.data?.reference !== donation.reference ||
        typeof result?.data?.authorization_url !== "string"
      ) {
        return Response.json(
          { error: "We couldn't start checkout. Please try again." },
          { status: 502 },
        );
      }

      // Only return a checkout address hosted by Paystack.
      const checkoutUrl = new URL(result.data.authorization_url);

      if (
        checkoutUrl.protocol !== "https:" ||
        checkoutUrl.hostname !== "checkout.paystack.com"
      ) {
        throw new Error("Unexpected checkout address.");
      }

      const [savedCheckout] = await sql`
  UPDATE donations
  SET
    checkout_url = ${checkoutUrl.toString()},
    checkout_state = 'ready'
  WHERE reference = ${donation.reference}
    AND checkout_attempt_token = ${attemptToken}
    AND checkout_state = 'initializing'
  RETURNING reference
`;

      if (!savedCheckout) {
        throw new Error("Checkout address could not be saved.");
      }
      checkoutSaved = true;

      return Response.json(
        {
          message: "Test checkout created.",
          reference: donation.reference,
          authorizationUrl: checkoutUrl.toString(),
          reused: false,
        },
        {
          status: 201,
          headers: { "Cache-Control": "no-store" },
        },
      );
    } finally {
      if (!checkoutSaved) {
        await sql`
      UPDATE donations
      SET checkout_state = 'needs_review'
      WHERE reference = ${donation.reference}
        AND checkout_attempt_token = ${attemptToken}
        AND checkout_state = 'initializing'
        AND checkout_url IS NULL
    `;
      }
    }
  } catch {
    return Response.json(
      {
        error: "We couldn't prepare checkout. Retry using the same request ID.",
      },
      { status: 503 },
    );
  }
}
