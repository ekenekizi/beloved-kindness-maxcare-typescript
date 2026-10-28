const attemptPrefix = "bkm:checkout:";
const referencePrefix = "bkm:payment-reference:";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getCheckoutAttempt(details: string) {
  // Identify matching details without storing the raw name or email.
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(details),
  );

  const fingerprint = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const storageKey = attemptPrefix + fingerprint;

  let requestId = sessionStorage.getItem(storageKey);

  if (requestId && !uuidPattern.test(requestId)) {
    throw new Error("The saved checkout attempt is invalid.");
  }

  if (!requestId) {
    requestId = crypto.randomUUID();

    // Save before contacting the server.
    sessionStorage.setItem(storageKey, requestId);
  }

  return { requestId, storageKey };
}

export function rememberCheckoutReference(
  reference: string,
  storageKey: string,
) {
  sessionStorage.setItem(referencePrefix + reference, storageKey);
}

export function clearCheckoutAttempt(reference: string) {
  try {
    const referenceKey = referencePrefix + reference;
    const storageKey = sessionStorage.getItem(referenceKey);

    if (storageKey && /^bkm:checkout:[0-9a-f]{64}$/.test(storageKey)) {
      sessionStorage.removeItem(storageKey);
    }

    sessionStorage.removeItem(referenceKey);
  } catch {
    // Storage cleanup must not turn a verified payment into an error.
  }
}
