import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import * as nodeCrypto from "node:crypto";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export const root = fileURLToPath(new URL("../../", import.meta.url));
export const testSecret = "sk_test_fake_key_for_local_tests_only";
export const reference = "BKM-11111111-1111-4111-8111-111111111111";
export const requestId = "22222222-2222-4222-8222-222222222222";
export const paidAt = "2026-10-01T12:00:00.000Z";
export const checkoutUrl = "https://checkout.paystack.com/local-test-checkout";
export const gift = {
  name: "Example Donor",
  email: "donor@example.com",
  amount: 10000,
  cause: "education",
  requestId,
};

const compiled = new Map();

export function transaction(overrides = {}) {
  return {
    reference,
    domain: "test",
    amount: 1000000,
    currency: "NGN",
    status: "success",
    paid_at: paidAt,
    ...overrides,
  };
}

export function postRequest(route, data, extraHeaders = {}) {
  return new Request(`http://localhost:3000/api/payments/${route}`, {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      "content-type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(data),
  });
}

export function webhookRequest(payload, signature) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  const headers = { "content-type": "application/json" };
  if (signature !== null) {
    headers["x-paystack-signature"] =
      signature ??
      nodeCrypto.createHmac("sha512", testSecret).update(body).digest("hex");
  }
  return new Request("http://localhost:3000/api/payments/webhook", {
    method: "POST",
    headers,
    body,
  });
}

export async function seedDonation(db, overrides = {}) {
  const row = {
    reference,
    donor_name: gift.name,
    donor_email: gift.email,
    amount_in_kobo: gift.amount * 100,
    currency: "NGN",
    cause: gift.cause,
    checkout_request_id: requestId,
    ...overrides,
  };
  const columns = Object.keys(row);
  // Column names are fixed test fixtures, never application/user input.
  await db.query(
    `INSERT INTO donations (${columns.join(", ")}) VALUES (${columns.map((_, index) => `$${index + 1}`).join(", ")})`,
    Object.values(row),
  );
}

export async function readDonation(db) {
  const { rows } = await db.query(
    "SELECT * FROM donations ORDER BY created_at LIMIT 1",
  );
  return rows[0];
}

export function createHarness(db, options = {}) {
  const requests = [];
  const queries = [];
  const cache = new Map();
  // Never inherit environment variables or credentials from the real process.
  const env = {
    PAYSTACK_SECRET_KEY: testSecret,
    APP_URL: "http://localhost:3000",
    ...options.env,
  };

  async function sql(strings, ...values) {
    const text = strings.reduce(
      (query, part, index) =>
        query + part + (index < values.length ? `$${index + 1}` : ""),
      "",
    );
    const query = { text, values };
    queries.push(query);
    await options.beforeQuery?.(query);
    // Execute the application's actual SQL, rather than duplicating CASE logic.
    const result = await db.query(text, values);
    return result.rows;
  }

  async function fakeFetch(url, init = {}) {
    const request = { url: String(url), init };
    requests.push(request);
    if (options.handleFetch) return options.handleFetch(request);
    if (request.url === "https://api.paystack.co/transaction/initialize") {
      const body = JSON.parse(init.body);
      return Response.json({
        status: true,
        data: {
          reference: body.reference,
          authorization_url: checkoutUrl,
        },
      });
    }
    if (request.url.startsWith("https://api.paystack.co/transaction/verify/")) {
      return Response.json({
        status: true,
        data: transaction(options.transaction),
      });
    }
    throw new Error(
      "Unexpected fetch; real network access is disabled in tests.",
    );
  }

  const context = vm.createContext({
    Request,
    Response,
    Headers,
    URL,
    Buffer,
    AbortSignal,
    TextEncoder,
    TextDecoder,
    ReadableStream,
    crypto: nodeCrypto.webcrypto,
    sessionStorage: options.sessionStorage,
    fetch: fakeFetch,
    process: { env },
  });

  function load(filename) {
    const absolute = path.resolve(root, filename);
    if (!absolute.startsWith(root))
      throw new Error("Module outside test project.");
    if (cache.has(absolute)) return cache.get(absolute).exports;
    if (!compiled.has(absolute)) {
      compiled.set(
        absolute,
        ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText,
      );
    }
    const loadedModule = { exports: {} };
    cache.set(absolute, loadedModule);
    const resolve = (id) => {
      if (id === "server-only") return {};
      if (id === "@/lib/db") return { getSql: () => sql };
      if (id === "node:crypto") return nodeCrypto;
      if (id.startsWith("@/")) return load(id.slice(2) + ".ts");
      if (id.startsWith("./") || id.startsWith("../")) {
        return load(
          path.relative(root, path.resolve(path.dirname(absolute), id + ".ts")),
        );
      }
      // In particular, never import the real Neon client or a mail sender.
      throw new Error(`Dependency not allowed in payment test: ${id}`);
    };
    const execute = vm.runInContext(
      `(function(require, module, exports) { ${compiled.get(absolute)}\n})`,
      context,
      { filename: absolute },
    );
    execute(resolve, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }

  return { load, requests, queries, env };
}

export function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    values,
  };
}
