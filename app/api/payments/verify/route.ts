import { verifyDonation } from "@/lib/payments/verify-donation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json(
      { error: "Please verify from our website." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please send valid JSON." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !("reference" in body) ||
    typeof body.reference !== "string"
  ) {
    return Response.json(
      { error: "Invalid verification request." },
      { status: 400 },
    );
  }

  return verifyDonation(body.reference);
}
