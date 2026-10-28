import "server-only";

import { getSql } from "@/lib/db";
import { verifyDonation } from "./verify-donation";

export async function inspectCheckoutRetry(
  reference: string,
): Promise<Response | null> {
  function respond(data: object, status = 200) {
    return Response.json(
      { ...data, reference },
      {
        status,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const sql = getSql();

  const [donation] = await sql`
    SELECT
      reference,
      status,
      checkout_url,
      checkout_state,
      (
        checkout_started_at > NOW() - INTERVAL '2 minutes'
      ) AS initialization_is_recent
    FROM donations
    WHERE reference = ${reference}
    LIMIT 1
  `;

  if (!donation) {
    return respond({ error: "Checkout attempt could not be found." }, 503);
  }

  if (donation.status === "successful") {
    return respond(
      {
        error: "This donation has already been paid.",
        code: "ALREADY_PAID",
      },
      409,
    );
  }

  if (donation.status !== "pending") {
    return respond(
      {
        error: "This donation cannot be resumed automatically.",
        code: "CHECKOUT_REVIEW_REQUIRED",
      },
      409,
    );
  }

  if (donation.checkout_url) {
    const checkoutUrl = new URL(donation.checkout_url);

    if (
      checkoutUrl.protocol !== "https:" ||
      checkoutUrl.hostname !== "checkout.paystack.com"
    ) {
      throw new Error("Unexpected saved checkout address.");
    }

    return respond({
      message: "Existing test checkout reused.",
      authorizationUrl: checkoutUrl.toString(),
      reused: true,
    });
  }

  // Nothing has claimed this attempt yet.
  // Let the caller continue to the existing atomic claim.
  if (donation.checkout_state === "created") {
    return null;
  }

  if (
    donation.checkout_state === "initializing" &&
    donation.initialization_is_recent === true
  ) {
    return respond(
      {
        error: "Checkout is being prepared. Please retry shortly.",
        code: "CHECKOUT_NOT_READY",
      },
      409,
    );
  }

  // Mark uncertain or stale initialization for investigation.
  // Recheck conditions here because another request may have progressed.
  const [uncertainDonation] = await sql`
    UPDATE donations
    SET checkout_state = 'needs_review'
    WHERE reference = ${reference}
      AND status = 'pending'
      AND checkout_url IS NULL
      AND (
        checkout_state IN ('needs_review', 'ready')
        OR (
          checkout_state = 'initializing'
          AND (
            checkout_started_at IS NULL
            OR checkout_started_at <= NOW() - INTERVAL '2 minutes'
          )
        )
      )
    RETURNING reference
  `;

  if (!uncertainDonation) {
    return respond(
      {
        error: "This checkout changed. Please retry to check its latest state.",
        code: "CHECKOUT_NOT_READY",
      },
      409,
    );
  }

  const verification = await verifyDonation(reference);

  if (!verification.ok) {
    return respond(
      {
        error:
          "We couldn't confirm this attempt's payment status. Keep this reference and contact us before starting another payment.",
        code: "CHECKOUT_RECOVERY_UNAVAILABLE",
      },
      503,
    );
  }

  const result = await verification.json();

  if (result?.verified === true && result?.status === "successful") {
    return respond(
      {
        error: "This donation has already been paid.",
        code: "ALREADY_PAID",
      },
      409,
    );
  }

  return respond(
    {
      error:
        "We couldn't safely resume this checkout. Keep this reference and contact us before starting another payment.",
      code: "CHECKOUT_REVIEW_REQUIRED",
    },
    409,
  );
}
