import "server-only";

import { getSql } from "@/lib/db";

function respond(data: object, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function verifyDonation(reference: string) {
  if (
    !/^BKM-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      reference,
    )
  ) {
    return respond({ error: "Invalid donation reference." }, 400);
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  // Keep this learning stage restricted to test payments.
  if (!secretKey?.startsWith("sk_test_")) {
    return respond({ error: "Test payment configuration is missing." }, 503);
  }

  try {
    const sql = getSql();

    const [donation] = await sql`
      SELECT reference, amount_in_kobo, currency
      FROM donations
      WHERE reference = ${reference}
      LIMIT 1
    `;

    if (!donation) {
      return respond({ error: "Donation record not found." }, 404);
    }

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );

    const result = await paystackResponse.json();

    if (!paystackResponse.ok || result?.status !== true || !result.data) {
      return respond(
        { error: "We couldn't verify the payment. Please try again." },
        502,
      );
    }

    const transaction = result.data;

    // Compare Paystack's information against our saved donation.
    if (
      transaction.domain !== "test" ||
      transaction.reference !== donation.reference ||
      transaction.currency !== donation.currency ||
      !Number.isSafeInteger(transaction.amount) ||
      String(transaction.amount) !== String(donation.amount_in_kobo)
    ) {
      return respond(
        { error: "Payment details do not match the donation record." },
        409,
      );
    }

    const knownStatuses = [
      "success",
      "failed",
      "abandoned",
      "reversed",
      "pending",
      "ongoing",
      "processing",
      "queued",
    ];

    if (
      typeof transaction.status !== "string" ||
      !knownStatuses.includes(transaction.status)
    ) {
      return respond({ error: "Unexpected payment status received." }, 502);
    }

    const providerStatus = transaction.status;

    let paidAt: string | null = null;

    if (providerStatus === "success") {
      if (
        typeof transaction.paid_at !== "string" ||
        Number.isNaN(Date.parse(transaction.paid_at))
      ) {
        return respond({ error: "Payment confirmation was incomplete." }, 502);
      }

      paidAt = transaction.paid_at;
    }

    const [updatedDonation] = await sql`
  UPDATE donations
  SET
    status = CASE
      WHEN status = 'reversed' THEN 'reversed'
      WHEN ${providerStatus} = 'reversed' THEN 'reversed'
      WHEN status = 'successful' THEN 'successful'
      WHEN ${providerStatus} = 'success' THEN 'successful'
      WHEN status = 'pending' AND ${providerStatus} = 'failed'
        THEN 'failed'
      WHEN status = 'pending' AND ${providerStatus} = 'abandoned'
        THEN 'abandoned'
      ELSE status
    END,
    provider_status = ${providerStatus},
    payment_last_checked_at = NOW(),
    paid_at = CASE
      WHEN ${providerStatus} = 'success' AND status <> 'reversed'
        THEN COALESCE(paid_at, ${paidAt}::timestamptz)
      ELSE paid_at
    END
  WHERE reference = ${reference}
    AND amount_in_kobo = ${donation.amount_in_kobo}
    AND currency = ${donation.currency}
  RETURNING reference, status, provider_status
`;

    if (!updatedDonation) {
      throw new Error("Donation could not be updated.");
    }

    return respond({
      verified: updatedDonation.status === "successful",
      reference: updatedDonation.reference,
      status: updatedDonation.status,
      message: "Payment status checked.",
    });
  } catch {
    return respond(
      {
        error: "Payment verification is temporarily unavailable. Please retry.",
      },
      503,
    );
  }
}
