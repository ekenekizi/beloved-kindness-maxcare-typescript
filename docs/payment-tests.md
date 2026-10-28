# Payment tests

Run from the project folder:

```bash
npm run test:payments
```

Run payment tests and the existing membership/partnership email tests:

```bash
npm test
```

## What runs

The payment suite uses Node's built-in test runner. PGlite, a development-only dependency, runs PostgreSQL in memory. The tests execute the application's actual SQL against that temporary database, including its unique constraints, checkout claims and status-transition CASE expressions. They do not implement a second copy of those rules in JavaScript.

The test harness loads the TypeScript routes and helpers with fake environment variables. Its database import is redirected to PGlite, and its fetch implementation is a Paystack substitute. It never imports the real Neon connection helper, loads `.env.local`, or sends requests to Paystack, Neon or Resend. No real donations or emails are created. Closing the test database discards its records.

The harness uses the same TypeScript-transpilation approach as the existing enquiry tests, with an isolated VM context and an explicit import allowlist. This avoids adding a separate application test framework.

## Files

- `tests/payments.test.mjs`: the test cases and assertions.
- `tests/helpers/payment-harness.mjs`: isolated module loader, fake provider, SQL adapter and fixtures.
- `tests/fixtures/payments-schema.sql`: the donations schema used locally. It matches the table and ALTER TABLE changes applied manually in Neon. Keep it in sync when the real schema changes. The tests never apply this file to Neon.

## What the assertions cover

- Webhook signatures: missing, malformed, incorrect, modified payloads and original JSON whitespace.
- Signed event validation, payload size limits, ignored events, provider outages and webhook replay.
- Reference, amount, currency, environment, timestamp and provider-status validation.
- Success, failure, abandonment, reversal and in-progress payment states.
- A second confirmation completing between a request's initial read and its update. Success cannot be overwritten by a stale failure; reversal cannot be undone by a stale success.
- Donor-name persistence, parameterized SQL, cancellation URL construction and validation failures.
- Sequential and simultaneous checkout retries, changed payload rejection, atomic ownership and one donation per request ID.
- Unclaimed, interrupted and uncertain initialization; failed URL persistence; trusted checkout URLs; test-key guards.
- Browser request-ID persistence across a simulated module reload and cleanup of only the matching payment attempt.

For example, the test named `a success recorded after the initial read cannot be overwritten by a late failure` inserts a pending donation, changes it to successful between the application's read and update, then runs the actual update with a stale provider failure. It checks that the API still returns success and the original payment timestamp remains intact.

## Limits

These are local integration tests, not browser or live-provider tests. PGlite uses one connection, so overlapping request tests check application interleaving and SQL constraints but do not reproduce every multi-connection lock or deployment race. Browser storage is represented by an in-memory Storage substitute; the React UI is not rendered. Your manual checkout and ngrok tests complement this suite.

Passing tests do not confirm live Paystack activation, international-card approval, settlement, production deployment configuration, request-rate protection or background reconciliation. Those still need their own implementation and deployed checks.
