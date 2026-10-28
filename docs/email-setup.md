# Membership and partnership email setup

The shared membership component posts to /api/membership. Partnership enquiries post to /api/partnership only after the visitor confirms the review dialog.

## Local configuration

Keep these variables in .env.local; do not use NEXT_PUBLIC_ prefixes:

- RESEND_API_KEY: your private sending key.
- EMAIL_FROM: BKM Website <onboarding@resend.dev> for initial testing.
- EMAIL_TO: the exact email associated with your Resend account during testing.

Never commit credentials. Existing Sanity variables must remain in the file. Restart npm run dev after configuration changes.

Production requires a verified sending domain and matching EMAIL_FROM address. Add all three variables to the hosting environment as well.

## Testing

Run npm run test:enquiries for mocked endpoint tests. They never send real email.

For the first live test, use synthetic application details and your own email address, review the form and press Submit. Check your inbox and the Resend dashboard. An API success means Resend accepted the email, not that inbox delivery is guaranteed. Retry a failed submission without editing to retain its provider idempotency key.

One notification goes to EMAIL_TO. Reply-To is the applicant's validated address. Applicant acknowledgement emails are not enabled while the test sender is in use. Nothing is stored in Sanity or a database.

## Protections and deployment follow-up

The endpoints validate on the server, limit payloads to 16 KiB, check request origin, check an empty honeypot and allow five attempts per ten minutes per address per process. User text is escaped in HTML emails; recipients and sender come from server configuration. Provider errors and application details are not logged.

The rate limiter is best-effort and local to one process. Before public launch, replace it with a shared deployment-aware limiter or add a server-verified CAPTCHA. Only trust forwarded IP headers supplied by your hosting provider. A reverse proxy must preserve the public request origin; verify both form routes on the deployed hostname. Persistent application storage, delivery monitoring and automatic acknowledgements are separate follow-ups.
