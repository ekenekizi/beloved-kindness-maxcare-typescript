export async function submitEnquiry(
  kind: "membership" | "partnership" | "counselling",
  data: unknown,
  submissionId: string,
  website: string,
): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/" + kind, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, submissionId, website }),
    });
  } catch {
    throw new Error(
      "We couldn't reach the server. Your details are still here; please try again.",
    );
  }
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.success !== true)
    throw new Error(
      typeof result?.error === "string"
        ? result.error
        : "We couldn't submit your enquiry. Please try again.",
    );
}
