import test, { before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import {
  root,
  reference,
  paidAt,
  checkoutUrl,
  gift,
  createHarness,
  postRequest,
  webhookRequest,
  seedDonation,
  readDonation,
  memoryStorage,
} from "./helpers/payment-harness.mjs";

let db;
before(
  async () => {
    db = await PGlite.create();
    await db.exec(
      fs.readFileSync(
        path.join(root, "tests/fixtures/payments-schema.sql"),
        "utf8",
      ),
    );
  },
  { timeout: 60000 },
);
beforeEach(async () => {
  await db.exec("TRUNCATE donations");
});
after(async () => {
  await db?.close();
});

const verifyPath = "app/api/payments/verify/route.ts";
const webhookPath = "app/api/payments/webhook/route.ts";
const initializePath = "app/api/payments/initialize/route.ts";
const inspectPath = "lib/payments/inspect-checkout-retry.ts";
const storagePath = "features/get-involved/data/checkout-storage.ts";
const event = { event: "charge.success", data: { reference } };
const verifyRequest = () => postRequest("verify", { reference });
const updates = (harness) =>
  harness.queries.filter((query) => /^\s*UPDATE/i.test(query.text));
const initializeCalls = (harness) =>
  harness.requests.filter((request) => request.url.endsWith("/initialize"));
async function countDonations() {
  return Number(
    (await db.query("SELECT COUNT(*) AS count FROM donations")).rows[0].count,
  );
}

test("signed webhook verifies payment and persists success using real PostgreSQL", async () => {
  await seedDonation(db);
  const h = createHarness(db);
  const response = await h.load(webhookPath).POST(webhookRequest(event));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "Payment confirmed.");
  const row = await readDonation(db);
  assert.equal(row.status, "successful");
  assert.equal(row.provider_status, "success");
  assert.equal(new Date(row.paid_at).toISOString(), paidAt);
  assert.ok(row.payment_last_checked_at);
});

for (const [name, signature] of [
  ["missing", null],
  ["malformed", "not-a-signature"],
  ["incorrect", "0".repeat(128)],
]) {
  test(`${name} webhook signature is rejected before database or provider access`, async () => {
    const h = createHarness(db);
    const response = await h
      .load(webhookPath)
      .POST(webhookRequest(event, signature));
    assert.equal(response.status, 401);
    assert.equal(h.requests.length, 0);
    assert.equal(h.queries.length, 0);
  });
}

test("changing signed webhook bytes invalidates its signature", async () => {
  const signed = webhookRequest(event);
  const signature = signed.headers.get("x-paystack-signature");
  const h = createHarness(db);
  const response = await h
    .load(webhookPath)
    .POST(webhookRequest(JSON.stringify(event) + " ", signature));
  assert.equal(response.status, 401);
  assert.equal(h.queries.length, 0);
});

test("webhook signature is checked against original whitespace, not reserialized JSON", async () => {
  await seedDonation(db);
  const h = createHarness(db);
  const response = await h
    .load(webhookPath)
    .POST(webhookRequest(JSON.stringify(event, null, 2)));
  assert.equal(response.status, 200);
  assert.equal((await readDonation(db)).status, "successful");
});

for (const [name, payload, status] of [
  ["oversized", "x".repeat(256 * 1024 + 1), 413],
  ["malformed JSON", "{", 400],
  ["missing event type", "{}", 400],
]) {
  test(`${name} webhook body is rejected without accessing payments`, async () => {
    const h = createHarness(db);
    assert.equal(
      (await h.load(webhookPath).POST(webhookRequest(payload))).status,
      status,
    );
    assert.equal(h.queries.length, 0);
    assert.equal(h.requests.length, 0);
  });
}

test("irrelevant signed events are acknowledged without changing donations", async () => {
  const h = createHarness(db);
  const response = await h
    .load(webhookPath)
    .POST(webhookRequest({ event: "customer.create", data: {} }));
  assert.equal(response.status, 200);
  assert.equal(h.queries.length, 0);
  assert.equal(h.requests.length, 0);
});

test("unknown signed donation reference is acknowledged without calling Paystack", async () => {
  const h = createHarness(db);
  const response = await h.load(webhookPath).POST(webhookRequest(event));
  assert.equal(response.status, 200);
  assert.equal(h.requests.length, 0);
});

test("replaying a webhook preserves one record and the original paid timestamp", async () => {
  await seedDonation(db);
  const h = createHarness(db);
  const route = h.load(webhookPath);
  for (let index = 0; index < 3; index++) {
    assert.equal((await route.POST(webhookRequest(event))).status, 200);
  }
  assert.equal(await countDonations(), 1);
  assert.equal(
    new Date((await readDonation(db)).paid_at).toISOString(),
    paidAt,
  );
});

test("provider outage leaves payment pending and webhook returns a retryable error", async () => {
  await seedDonation(db);
  const h = createHarness(db, {
    handleFetch: async () => {
      throw new Error("simulated timeout");
    },
  });
  assert.equal(
    (await h.load(webhookPath).POST(webhookRequest(event))).status,
    503,
  );
  const row = await readDonation(db);
  assert.equal(row.status, "pending");
  assert.equal(row.payment_last_checked_at, null);
  assert.equal(row.paid_at, null);
});

for (const [name, overrides] of [
  ["wrong amount", { amount: 1 }],
  ["wrong currency", { currency: "USD" }],
  [
    "wrong reference",
    { reference: "BKM-33333333-3333-4333-8333-333333333333" },
  ],
  ["live transaction in test mode", { domain: "live" }],
  ["fractional subunit amount", { amount: 1000000.5 }],
]) {
  test(`${name} cannot update a donation or report verified success`, async () => {
    await seedDonation(db);
    const h = createHarness(db, { transaction: overrides });
    const response = await h.load(verifyPath).POST(verifyRequest());
    assert.equal(response.status, 409);
    assert.notEqual((await response.json()).verified, true);
    assert.equal(updates(h).length, 0);
    const row = await readDonation(db);
    assert.equal(row.status, "pending");
    assert.equal(row.paid_at, null);
  });
}

for (const [providerStatus, expectedStatus] of [
  ["success", "successful"],
  ["failed", "failed"],
  ["abandoned", "abandoned"],
  ["pending", "pending"],
  ["ongoing", "pending"],
  ["processing", "pending"],
  ["queued", "pending"],
  ["reversed", "reversed"],
]) {
  test(`Paystack ${providerStatus} is saved as ${expectedStatus} with a checked timestamp`, async () => {
    await seedDonation(db);
    const h = createHarness(db, { transaction: { status: providerStatus } });
    const response = await h.load(verifyPath).POST(verifyRequest());
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.status, expectedStatus);
    assert.equal(result.verified, expectedStatus === "successful");
    const row = await readDonation(db);
    assert.equal(row.provider_status, providerStatus);
    assert.ok(row.payment_last_checked_at);
    if (expectedStatus !== "successful") assert.equal(row.paid_at, null);
  });
}

for (const [name, overrides] of [
  ["unknown status", { status: "unexpected" }],
  ["missing success timestamp", { paid_at: null }],
  ["invalid success timestamp", { paid_at: "not-a-date" }],
]) {
  test(`${name} is rejected without changing financial status`, async () => {
    await seedDonation(db);
    const h = createHarness(db, { transaction: overrides });
    assert.equal((await h.load(verifyPath).POST(verifyRequest())).status, 502);
    assert.equal(updates(h).length, 0);
  });
}

test("a success recorded after the initial read cannot be overwritten by a late failure", async () => {
  await seedDonation(db);
  let intervened = false;
  const h = createHarness(db, {
    transaction: { status: "failed" },
    beforeQuery: async ({ text }) => {
      if (!intervened && /^\s*UPDATE/i.test(text)) {
        intervened = true;
        // Simulate another callback completing between this request's read and update.
        await db.query(
          "UPDATE donations SET status = 'successful', paid_at = $1 WHERE reference = $2",
          [paidAt, reference],
        );
      }
    },
  });
  const result = await (await h.load(verifyPath).POST(verifyRequest())).json();
  assert.equal(intervened, true);
  assert.equal(result.verified, true);
  assert.equal(result.status, "successful");
  assert.equal(
    new Date((await readDonation(db)).paid_at).toISOString(),
    paidAt,
  );
});

test("a reversal recorded after the read cannot be undone by a late success", async () => {
  await seedDonation(db, { status: "successful", paid_at: paidAt });
  let intervened = false;
  const h = createHarness(db, {
    beforeQuery: async ({ text }) => {
      if (!intervened && /^\s*UPDATE/i.test(text)) {
        intervened = true;
        await db.query(
          "UPDATE donations SET status = 'reversed' WHERE reference = $1",
          [reference],
        );
      }
    },
  });
  const result = await (await h.load(verifyPath).POST(verifyRequest())).json();
  assert.equal(result.verified, false);
  assert.equal(result.status, "reversed");
  assert.equal(
    new Date((await readDonation(db)).paid_at).toISOString(),
    paidAt,
  );
});

test("a confirmed late success can recover an abandoned donation", async () => {
  await seedDonation(db, { status: "abandoned" });
  const h = createHarness(db);
  const result = await (await h.load(verifyPath).POST(verifyRequest())).json();
  assert.equal(result.status, "successful");
  assert.equal(result.verified, true);
});

test("an old success webhook is acknowledged after verification confirms a reversal", async () => {
  await seedDonation(db, { status: "successful", paid_at: paidAt });
  const h = createHarness(db, { transaction: { status: "reversed" } });
  const response = await h.load(webhookPath).POST(webhookRequest(event));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "Payment reversal recorded.");
  assert.equal((await readDonation(db)).status, "reversed");
});

test("foreign origin cannot invoke browser verification", async () => {
  const h = createHarness(db);
  const response = await h
    .load(verifyPath)
    .POST(
      postRequest("verify", { reference }, { origin: "https://other.example" }),
    );
  assert.equal(response.status, 403);
  assert.equal(h.requests.length, 0);
  assert.equal(h.queries.length, 0);
});

test("invalid verification reference is rejected before database access", async () => {
  const h = createHarness(db);
  const response = await h
    .load(verifyPath)
    .POST(postRequest("verify", { reference: "not-a-reference" }));
  assert.equal(response.status, 400);
  assert.equal(h.queries.length, 0);
});

for (const [name, changes] of [
  ["invalid request ID", { requestId: "invalid" }],
  ["invalid email", { email: "invalid" }],
  ["negative amount", { amount: -10 }],
  ["too many decimal places", { amount: 10.001 }],
  ["unknown cause", { cause: "other" }],
  ["control characters in name", { name: "Example\nDonor" }],
]) {
  test(`initialization rejects ${name} without saving or contacting Paystack`, async () => {
    const h = createHarness(db);
    const response = await h
      .load(initializePath)
      .POST(postRequest("initialize", { ...gift, ...changes }));
    assert.equal(response.status, 400);
    assert.equal(await countDonations(), 0);
    assert.equal(h.requests.length, 0);
  });
}

test("checkout saves donor name, integer amount and claim before exposing a trusted URL", async () => {
  const h = createHarness(db);
  const response = await h
    .load(initializePath)
    .POST(postRequest("initialize", gift));
  const result = await response.json();
  assert.equal(response.status, 201);
  const row = await readDonation(db);
  assert.equal(row.donor_name, gift.name);
  assert.equal(String(row.amount_in_kobo), "1000000");
  assert.equal(row.checkout_state, "ready");
  assert.equal(row.checkout_url, checkoutUrl);
  assert.ok(row.checkout_attempt_token);
  assert.ok(row.checkout_started_at);
  assert.equal(row.reference, result.reference);
  assert.equal(row.status, "pending");
  const providerRequest = JSON.parse(h.requests[0].init.body);
  assert.equal(providerRequest.reference, row.reference);
  assert.equal(providerRequest.amount, 1000000);
  assert.equal(providerRequest.currency, "NGN");
  const cancellation = new URL(providerRequest.metadata.cancel_action);
  assert.equal(cancellation.origin, "http://localhost:3000");
  assert.equal(cancellation.searchParams.get("reference"), row.reference);
  assert.equal(cancellation.searchParams.get("cancelled"), "1");
});

test("donor text is parameterized SQL data rather than executable SQL", async () => {
  const name = "Robert'); DROP TABLE donations; --";
  const h = createHarness(db);
  const response = await h
    .load(initializePath)
    .POST(postRequest("initialize", { ...gift, name }));
  assert.equal(response.status, 201);
  assert.equal((await readDonation(db)).donor_name, name);
  assert.equal(await countDonations(), 1);
});

test("sequential retries reuse the saved checkout without a second initialization", async () => {
  const h = createHarness(db);
  const route = h.load(initializePath);
  const first = await (
    await route.POST(postRequest("initialize", gift))
  ).json();
  const response = await route.POST(postRequest("initialize", gift));
  const retry = await response.json();
  assert.equal(response.status, 200);
  assert.equal(retry.reused, true);
  assert.equal(retry.reference, first.reference);
  assert.equal(retry.authorizationUrl, first.authorizationUrl);
  assert.equal(await countDonations(), 1);
  assert.equal(initializeCalls(h).length, 1);
});

test("a reused request ID with changed donor details is rejected", async () => {
  const h = createHarness(db);
  const route = h.load(initializePath);
  assert.equal((await route.POST(postRequest("initialize", gift))).status, 201);
  const response = await route.POST(
    postRequest("initialize", { ...gift, amount: 25000 }),
  );
  assert.equal(response.status, 409);
  assert.equal(await countDonations(), 1);
  assert.equal(initializeCalls(h).length, 1);
});

test(
  "simultaneous requests have one initialization owner and one donation record",
  { timeout: 10000 },
  async () => {
    let providerStarted;
    let releaseProvider;
    const started = new Promise((resolve) => {
      providerStarted = resolve;
    });
    const release = new Promise((resolve) => {
      releaseProvider = resolve;
    });
    const h = createHarness(db, {
      handleFetch: async ({ init }) => {
        providerStarted();
        await release;
        return Response.json({
          status: true,
          data: {
            reference: JSON.parse(init.body).reference,
            authorization_url: checkoutUrl,
          },
        });
      },
    });
    const route = h.load(initializePath);
    const first = route.POST(postRequest("initialize", gift));
    await started;
    let second;
    try {
      second = await route.POST(postRequest("initialize", gift));
      assert.equal(second.status, 409);
      assert.equal((await second.json()).code, "CHECKOUT_NOT_READY");
    } finally {
      releaseProvider();
      await first;
    }
    assert.equal((await first).status, 201);
    assert.equal(await countDonations(), 1);
    assert.equal(initializeCalls(h).length, 1);
  },
);

test("created-but-unclaimed donation resumes with its original reference", async () => {
  await seedDonation(db);
  const h = createHarness(db);
  const response = await h
    .load(initializePath)
    .POST(postRequest("initialize", gift));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).reference, reference);
  assert.equal((await readDonation(db)).checkout_state, "ready");
  assert.equal(await countDonations(), 1);
});

for (const [name, providerResponse] of [
  [
    "provider rejection",
    async () => Response.json({ status: false }, { status: 400 }),
  ],
  [
    "provider timeout",
    async () => {
      throw new Error("simulated timeout");
    },
  ],
  [
    "untrusted checkout URL",
    async ({ init }) =>
      Response.json({
        status: true,
        data: {
          reference: JSON.parse(init.body).reference,
          authorization_url: "https://other.example/pay",
        },
      }),
  ],
]) {
  test(`${name} preserves the attempt as needs_review without an exposed checkout URL`, async () => {
    const h = createHarness(db, { handleFetch: providerResponse });
    const response = await h
      .load(initializePath)
      .POST(postRequest("initialize", gift));
    assert.ok([502, 503].includes(response.status));
    assert.equal((await response.json()).authorizationUrl, undefined);
    const row = await readDonation(db);
    assert.equal(row.checkout_state, "needs_review");
    assert.equal(row.status, "pending");
    assert.equal(row.checkout_url, null);
    assert.ok(row.checkout_attempt_token);
  });
}

test("failure saving Paystack's URL does not return that URL or lose the review state", async () => {
  let failedSave = false;
  const h = createHarness(db, {
    beforeQuery: async ({ text }) => {
      if (!failedSave && /SET\s+checkout_url\s*=/i.test(text)) {
        failedSave = true;
        throw new Error("simulated database write outage");
      }
    },
  });
  const response = await h
    .load(initializePath)
    .POST(postRequest("initialize", gift));
  assert.equal(response.status, 503);
  assert.equal(failedSave, true);
  assert.equal((await readDonation(db)).checkout_state, "needs_review");
  assert.equal((await readDonation(db)).checkout_url, null);
});

test("stale uncertain attempt is verified rather than initialized again", async () => {
  await seedDonation(db, {
    checkout_state: "initializing",
    checkout_started_at: "2020-01-01T00:00:00Z",
  });
  const h = createHarness(db, {
    handleFetch: async () => Response.json({ status: false }, { status: 404 }),
  });
  const response = await h
    .load(initializePath)
    .POST(postRequest("initialize", gift));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "CHECKOUT_RECOVERY_UNAVAILABLE");
  assert.equal(initializeCalls(h).length, 0);
  assert.equal(h.requests.length, 1);
  assert.ok(h.requests[0].url.endsWith(`/verify/${reference}`));
  assert.equal((await readDonation(db)).checkout_state, "needs_review");
  assert.equal(await countDonations(), 1);
});

test("uncertain attempt with a confirmed payment returns ALREADY_PAID", async () => {
  await seedDonation(db, { checkout_state: "needs_review" });
  const h = createHarness(db);
  const response = await h.load(inspectPath).inspectCheckoutRetry(reference);
  assert.equal(response.status, 409);
  assert.equal((await response.json()).code, "ALREADY_PAID");
  assert.equal((await readDonation(db)).status, "successful");
  assert.equal(initializeCalls(h).length, 0);
});

test("initialization rejects a live key while this integration is in test mode", async () => {
  const h = createHarness(db, {
    env: { PAYSTACK_SECRET_KEY: "sk_live_fake_not_a_real_key" },
  });
  assert.equal(
    (await h.load(initializePath).POST(postRequest("initialize", gift))).status,
    503,
  );
  assert.equal(h.requests.length, 0);
  assert.equal(h.queries.length, 0);
});

test("browser storage reuses an attempt after module reload without storing raw donor details", async () => {
  const storage = memoryStorage();
  const details = JSON.stringify(gift);
  const first = await createHarness(db, { sessionStorage: storage })
    .load(storagePath)
    .getCheckoutAttempt(details);
  const reloaded = createHarness(db, { sessionStorage: storage }).load(
    storagePath,
  );
  const second = await reloaded.getCheckoutAttempt(details);
  assert.equal(second.requestId, first.requestId);
  assert.equal(second.storageKey, first.storageKey);
  assert.equal(storage.values.size, 1);
  assert.equal([...storage.values.keys()].join().includes(gift.email), false);
  assert.equal([...storage.values.values()].join().includes(gift.name), false);
  const changed = await reloaded.getCheckoutAttempt(
    JSON.stringify({ ...gift, amount: 25000 }),
  );
  assert.notEqual(changed.requestId, first.requestId);
});

test("success cleanup clears only the matching browser attempt", async () => {
  const storage = memoryStorage();
  const helper = createHarness(db, { sessionStorage: storage }).load(
    storagePath,
  );
  const first = await helper.getCheckoutAttempt(JSON.stringify(gift));
  const other = await helper.getCheckoutAttempt(
    JSON.stringify({ ...gift, amount: 25000 }),
  );
  helper.rememberCheckoutReference(reference, first.storageKey);
  helper.clearCheckoutAttempt(reference);
  assert.equal(storage.getItem(first.storageKey), null);
  assert.equal(storage.getItem(other.storageKey), other.requestId);
  assert.notEqual(
    (await helper.getCheckoutAttempt(JSON.stringify(gift))).requestId,
    first.requestId,
  );
});

test("blocked browser storage fails before an unremembered request ID can be used", async () => {
  const helper = createHarness(db, {
    sessionStorage: {
      getItem() {
        throw new Error("storage blocked");
      },
    },
  }).load(storagePath);
  await assert.rejects(
    helper.getCheckoutAttempt(JSON.stringify(gift)),
    /storage blocked/,
  );
  assert.doesNotThrow(() => helper.clearCheckoutAttempt(reference));
});
