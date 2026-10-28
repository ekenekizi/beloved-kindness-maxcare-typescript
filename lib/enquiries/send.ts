import "server-only";
import { createHash } from "node:crypto";
import { Resend } from "resend";
import {
  SubmissionError,
  type EmailField,
  type ValidatedEnquiry,
} from "./validation";
export type EnquiryKind = "membership" | "partnership";
function escape(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
}
export function formatEnquiry(kind: EnquiryKind, fields: EmailField[]) {
  const title =
    kind === "membership"
      ? "New membership / volunteer application"
      : "New partnership enquiry";
  return {
    subject: "BKM: " + title,
    text:
      title +
      "\n\n" +
      fields.map((field) => field.label + ":\n" + field.value).join("\n\n"),
    html:
      '<div style="font-family:Arial,sans-serif;max-width:680px;color:#142f50"><h1 style="font-size:24px">' +
      title +
      "</h1><p>A website visitor submitted the following details. Reply to this email to contact them.</p><dl>" +
      fields
        .map(
          (field) =>
            '<dt style="font-weight:bold;margin-top:18px">' +
            escape(field.label) +
            '</dt><dd style="margin:6px 0;white-space:pre-wrap">' +
            escape(field.value) +
            "</dd>",
        )
        .join("") +
      "</dl></div>",
  };
}
export async function sendEnquiry(
  kind: EnquiryKind,
  enquiry: ValidatedEnquiry,
  submissionId: string,
): Promise<void> {
  const key = process.env.RESEND_API_KEY,
    from = process.env.EMAIL_FROM,
    to = process.env.EMAIL_TO;
  if (
    !key ||
    !from ||
    !to ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) ||
    /[\r\n]/.test(from)
  )
    throw new SubmissionError(
      "The enquiry service is temporarily unavailable. Please try again later.",
      503,
    );
  const resend = new Resend(key);
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(enquiry))
    .digest("hex");
  const { data, error } = await resend.emails.send(
    {
      from,
      to: [to],
      replyTo: enquiry.replyTo,
      ...formatEnquiry(kind, enquiry.fields),
    },
    { idempotencyKey: kind + ":" + submissionId + ":" + fingerprint },
  );
  if (error || !data?.id) {
    // Do not expose provider errors, credentials or application details to the browser/logs.
    throw new SubmissionError(
      "We couldn't submit your enquiry. Please try again.",
      502,
    );
  }
}
