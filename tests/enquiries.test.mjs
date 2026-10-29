import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createRequire } from "node:module";
const nodeRequire = createRequire(import.meta.url);
function environment(t) {
  const previous = Object.fromEntries(
    ["RESEND_API_KEY", "EMAIL_FROM", "EMAIL_TO"].map((key) => [
      key,
      process.env[key],
    ]),
  );
  Object.assign(process.env, {
    RESEND_API_KEY: "re_test",
    EMAIL_FROM: "BKM <onboarding@resend.dev>",
    EMAIL_TO: "owner@example.com",
  });
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}
function modules(
  send = async () => ({ data: { id: "test-email" }, error: null }),
) {
  const cache = new Map(),
    calls = [];
  function load(file) {
    const absolute = path.resolve(file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const loadedModule = { exports: {} };
    cache.set(absolute, loadedModule);
    const code = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText;
    const resolver = (id) => {
      if (id === "server-only") return {};
      if (id === "resend") {
        class FakeResend {
          constructor() {
            this.emails = {
              send: async (payload, options) => {
                calls.push({ payload, options });
                return send(payload, options);
              },
            };
          }
        }
        return { Resend: FakeResend };
      }
      if (id.startsWith("./"))
        return load(path.join(path.dirname(absolute), id + ".ts"));
      if (id.startsWith("@/")) return load(id.slice(2) + ".ts");
      return nodeRequire(id);
    };
    new Function("require", "module", "exports", code)(
      resolver,
      loadedModule,
      loadedModule.exports,
    );
    return loadedModule.exports;
  }
  return { load, calls };
}
const membership = {
  fullName: "Example Applicant",
  email: "applicant@example.com",
  phone: "+2348000000000",
  gender: "Female",
  countryOfOrigin: "Nigeria",
  stateOfOrigin: "Abuja",
  countryOfResidence: "Nigeria",
  stateOfResidence: "Abuja",
  employmentStatus: "Student",
  referralSource: "Our website",
  motivation: "I would like to help.",
  consent: true,
};
const partnership = {
  areas: ["orphanage", "widows"],
  values: {
    firstName: "Example",
    lastName: "Applicant",
    email: "applicant@example.com",
    phone: "+2348000000000",
    countryOfOrigin: "Nigeria",
    countryOfResidence: "Nigeria",
    gender: "male",
    orphanageEducation: ["School fees"],
    healthcare: "First aid supplies",
    orphanageSupplies: ["Rice"],
    widowSupport: ["Rent / accommodation"],
    widowSupplies: ["Beans"],
  },
};
const envelope = (data) => ({
  data,
  website: "",
  submissionId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
});
function request(data, options = {}) {
  return new Request("http://localhost:3000/api/membership", {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      "content-type": "application/json",
      "x-forwarded-for": "127.0.0.1",
      ...options.headers,
    },
    body: options.body ?? JSON.stringify(data),
  });
}
test("membership endpoint sends validated details to the configured inbox", async (t) => {
  environment(t);
  const m = modules();
  const { POST } = m.load("app/api/membership/route.ts");
  const response = await POST(request(envelope(membership)));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(m.calls.length, 1);
  assert.deepEqual(m.calls[0].payload.to, ["owner@example.com"]);
  assert.equal(m.calls[0].payload.replyTo, membership.email);
  assert.ok(m.calls[0].payload.text.includes(membership.motivation));
});
test("partnership endpoint includes only selected support areas", async (t) => {
  environment(t);
  const m = modules();
  const { POST } = m.load("app/api/partnership/route.ts");
  const input = { ...partnership, areas: ["orphanage"] };
  const response = await POST(request(envelope(input)));
  assert.equal(response.status, 200);
  assert.ok(m.calls[0].payload.text.includes("School fees"));
  assert.ok(!m.calls[0].payload.text.includes("Rent / accommodation"));
});
test("consent, email, phone, enum and selected-area validation reject invalid submissions", async (t) => {
  environment(t);
  const { load } = modules();
  const v = load("lib/enquiries/validation.ts");
  for (const data of [
    { ...membership, consent: false },
    { ...membership, email: "bad" },
    { ...membership, phone: "1" },
    { ...membership, gender: "unexpected" },
    { ...membership, motivation: "a".repeat(2001) },
    { ...membership, fullName: [] },
  ])
    assert.throws(() => v.validateMembership(data), v.SubmissionError);
  assert.throws(
    () => v.validatePartnership({ ...partnership, areas: [] }),
    v.SubmissionError,
  );
  assert.throws(
    () =>
      v.validatePartnership({
        ...partnership,
        values: { ...partnership.values, orphanageEducation: ["unknown"] },
      }),
    v.SubmissionError,
  );
});
test("foreign origins, honeypots and invalid request bodies never send email", async (t) => {
  environment(t);
  const m = modules();
  const { handleEnquiry } = m.load("lib/enquiries/handler.ts");
  assert.equal(
    (
      await handleEnquiry(
        request(envelope(membership), {
          headers: { origin: "https://another.example" },
        }),
        "membership",
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleEnquiry(
        request({ ...envelope(membership), website: "spam" }),
        "membership",
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handleEnquiry(
        request(envelope(membership), {
          headers: { "content-type": "text/plain" },
        }),
        "membership",
      )
    ).status,
    415,
  );
  assert.equal(
    (await handleEnquiry(request(null, { body: "{" }), "membership")).status,
    400,
  );
  assert.equal(
    (
      await handleEnquiry(
        request(null, { body: "x".repeat(17000) }),
        "membership",
      )
    ).status,
    413,
  );
  assert.equal(m.calls.length, 0);
});
test("local rate limiting stops a sixth request", async (t) => {
  environment(t);
  const m = modules();
  const { handleEnquiry } = m.load("lib/enquiries/handler.ts");
  for (let i = 0; i < 5; i++)
    assert.equal(
      (await handleEnquiry(request(envelope(membership)), "membership")).status,
      200,
    );
  assert.equal(
    (await handleEnquiry(request(envelope(membership)), "membership")).status,
    429,
  );
  assert.equal(m.calls.length, 5);
});
test("retries reuse the provider idempotency key and email HTML escapes submitted text", async (t) => {
  environment(t);
  const m = modules();
  const { handleEnquiry } = m.load("lib/enquiries/handler.ts");
  const input = envelope({
    ...membership,
    motivation: '<script>alert("test")</script>',
  });
  await handleEnquiry(request(input), "membership");
  await handleEnquiry(request(input), "membership");
  assert.equal(
    m.calls[0].options.idempotencyKey,
    m.calls[1].options.idempotencyKey,
  );
  assert.ok(!m.calls[0].payload.html.includes("<script>"));
  assert.ok(m.calls[0].payload.html.includes("&lt;script&gt;"));
});
test("provider failure and missing credentials return generic errors without reporting success", async (t) => {
  environment(t);
  const m = modules(async () => ({
    data: null,
    error: { message: "sensitive provider details" },
  }));
  const { handleEnquiry } = m.load("lib/enquiries/handler.ts");
  const response = await handleEnquiry(
    request(envelope(membership)),
    "membership",
  );
  assert.equal(response.status, 502);
  assert.ok(!JSON.stringify(await response.json()).includes("sensitive"));
  delete process.env.RESEND_API_KEY;
  const unavailable = await handleEnquiry(
    request(envelope(membership)),
    "membership",
  );
  assert.equal(unavailable.status, 503);
});

const counselling = {
  parentName: "Example Guardian", email: "parent@example.com", phone: "+2348000000000",
  childFirstName: "Example", childAge: 9, contactMethod: "Email", guardian: true, consent: true,
};
test("counselling request requires a dedicated inbox and never falls back to the general inbox", async (t) => {
  environment(t);
  const previous = process.env.COUNSELLING_EMAIL_TO;
  delete process.env.COUNSELLING_EMAIL_TO;
  t.after(() => { if (previous === undefined) delete process.env.COUNSELLING_EMAIL_TO; else process.env.COUNSELLING_EMAIL_TO = previous; });
  const m = modules();
  const { POST } = m.load("app/api/counselling/route.ts");
  const response = await POST(request(envelope(counselling)));
  assert.equal(response.status, 503);
  assert.equal(m.calls.length, 0);
});
test("counselling enquiry sends only the intake fields to its designated recipient", async (t) => {
  environment(t);
  const previous = process.env.COUNSELLING_EMAIL_TO;
  process.env.COUNSELLING_EMAIL_TO = "counsellor@example.com";
  t.after(() => { if (previous === undefined) delete process.env.COUNSELLING_EMAIL_TO; else process.env.COUNSELLING_EMAIL_TO = previous; });
  const m = modules();
  const { POST } = m.load("app/api/counselling/route.ts");
  const response = await POST(request(envelope({ ...counselling, diagnosis: "PRIVATE-UNEXPECTED-FIELD" })));
  assert.equal(response.status, 200);
  assert.deepEqual(m.calls[0].payload.to, ["counsellor@example.com"]);
  assert.equal(m.calls[0].payload.replyTo, counselling.email);
  assert.ok(m.calls[0].payload.subject.includes("counselling"));
  assert.ok(m.calls[0].payload.text.includes(counselling.childFirstName));
  assert.ok(!m.calls[0].payload.text.includes("PRIVATE-UNEXPECTED-FIELD"));
});
test("counselling validation rejects invalid ages, contact preferences and missing guardian consent", () => {
  const { load } = modules();
  const { validateCounselling, SubmissionError } = load("lib/enquiries/validation.ts");
  for (const change of [
    { childAge: -1 }, { childAge: 18 }, { childAge: 2.5 }, { childAge: "9" },
    { childAge: null }, { guardian: false }, { consent: false },
    { contactMethod: "unexpected" }, { phone: "1" }, { email: "invalid" }, { childFirstName: "" },
  ]) assert.throws(() => validateCounselling({ ...counselling, ...change }), SubmissionError);
});
