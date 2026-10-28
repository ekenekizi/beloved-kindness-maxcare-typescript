import { createHmac, timingSafeEqual } from "node:crypto";

import { verifyDonation } from "@/lib/payments/verify-donation";

export const runtime = "nodejs";

// Read the exact request bytes, with a bounded payload size.
async function readPayload(request: Request): Promise<Buffer | null> {
  const reader = request.body?.getReader();

  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      size += value.byteLength;

      if (size > 256 * 1024) {
        await reader.cancel();
        return null;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  // Keep the current integration restricted to test payments.
  if (!secretKey?.startsWith("sk_test_")) {
    return new Response("Payment configuration unavailable.", {
      status: 503,
    });
  }

  const signature = request.headers.get("x-paystack-signature");

  if (!signature || !/^[0-9a-f]{128}$/i.test(signature)) {
    return new Response("Invalid signature.", { status: 401 });
  }

  try {
    const payload = await readPayload(request);

    if (!payload) {
      return new Response("Invalid or oversized payload.", {
        status: 413,
      });
    }

    const expectedSignature = createHmac("sha512", secretKey)
      .update(payload)
      .digest();

    const receivedSignature = Buffer.from(signature, "hex");

    if (!timingSafeEqual(expectedSignature, receivedSignature)) {
      return new Response("Invalid signature.", { status: 401 });
    }

    let event;

    try {
      event = JSON.parse(payload.toString("utf8"));
    } catch {
      return new Response("Invalid JSON.", { status: 400 });
    }

    if (typeof event?.event !== "string") {
      return new Response("Invalid event.", { status: 400 });
    }

    // We currently process successful payment notifications only.
    if (event.event !== "charge.success") {
      return new Response("Event ignored.", { status: 200 });
    }

    const reference = event?.data?.reference;

    // Ignore payments that do not use our donation reference format.
    if (
      typeof reference !== "string" ||
      !/^BKM-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        reference,
      )
    ) {
      return new Response("Unrelated payment ignored.", { status: 200 });
    }

    const verification = await verifyDonation(reference);

    // This account may receive payments outside our application.
    if (verification.status === 404) {
      return new Response("Unknown donation ignored.", { status: 200 });
    }

    if (!verification.ok) {
      return new Response("Payment could not be confirmed.", {
        status: 503,
      });
    }

    const result = await verification.json();

    if (result?.status === "reversed") {
      return new Response("Payment reversal recorded.", { status: 200 });
    }

    if (result?.verified !== true) {
      return new Response("Payment confirmation is not ready.", {
        status: 503,
      });
    }

    return new Response("Payment confirmed.", { status: 200 });
  } catch {
    return new Response("Webhook processing unavailable.", {
      status: 503,
    });
  }
}
