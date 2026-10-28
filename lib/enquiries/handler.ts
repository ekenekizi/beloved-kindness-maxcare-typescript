import "server-only";
import { createHash } from "node:crypto";
import {
  SubmissionError,
  validateMembership,
  validatePartnership,
} from "./validation";
import { sendEnquiry, type EnquiryKind } from "./send";

// Best-effort local limits. A shared limiter is needed across production instances.
const attempts = new Map<string, { count: number; expires: number }>();
function limit(request: Request): void {
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.expires <= now) attempts.delete(key);
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = createHash("sha256").update(address).digest("hex");
  const record = attempts.get(key);
  if (record && record.count >= 5)
    throw new SubmissionError(
      "Too many attempts. Please wait ten minutes before trying again.",
      429,
    );
  if (!record && attempts.size >= 10000)
    throw new SubmissionError("Please try again later.", 429);
  attempts.set(key, {
    count: (record?.count ?? 0) + 1,
    expires: record?.expires ?? now + 10 * 60 * 1000,
  });
}
async function readBody(request: Request): Promise<unknown> {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    throw new SubmissionError("Send a JSON submission.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new SubmissionError("Your submission was empty.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16 * 1024) {
        await reader.cancel();
        throw new SubmissionError("Your submission is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new SubmissionError(
      "Your submission could not be read. Please try again.",
    );
  }
}
export async function handleEnquiry(
  request: Request,
  kind: EnquiryKind,
): Promise<Response> {
  try {
    const origin = request.headers.get("origin");
    if (origin !== new URL(request.url).origin)
      throw new SubmissionError(
        "Please submit this form from our website.",
        403,
      );
    limit(request);
    const body = await readBody(request);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new SubmissionError("Please check your submission.");
    const envelope = body as Record<string, unknown>;
    if (typeof envelope.website !== "string" || envelope.website !== "")
      throw new SubmissionError("Your submission could not be accepted.");
    if (
      typeof envelope.submissionId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        envelope.submissionId,
      )
    )
      throw new SubmissionError(
        "Please review the form again before submitting.",
      );
    const enquiry =
      kind === "membership"
        ? validateMembership(envelope.data)
        : validatePartnership(envelope.data);
    await sendEnquiry(kind, enquiry, envelope.submissionId);
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const known = error instanceof SubmissionError;
    return Response.json(
      {
        error: known
          ? error.message
          : "We couldn't submit your enquiry. Please try again.",
      },
      {
        status: known ? error.status : 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
