import { test } from "node:test";
import assert from "node:assert/strict";
import { networkOperation, NetworkIssue, connectionMessage } from "../src/services/chatgpt/network";

test("DNS failure is attributed to the correct stage without leaking request details or replaying it", async () => {
  let attempts = 0;
  await assert.rejects(networkOperation("token", "auth.openai.com", async () => {
    attempts++;
    throw new Error('fetch failed: java.net.UnknownHostException: Unable to resolve host "auth.openai.com" code=secret-example');
  }), (error: unknown) => {
    assert.ok(error instanceof NetworkIssue);
    assert.equal(error.kind, "dns");
    assert.equal(error.stage, "token");
    assert.match(connectionMessage(error, "es"), /completar la sesión/);
    assert.doesNotMatch(connectionMessage(error, "es"), /secret-example/);
    return true;
  });
  assert.equal(attempts, 1);
});

test("cancel during a network request aborts transport and does not become a DNS error", async () => {
  const control = new AbortController();
  let transportSignal: AbortSignal | undefined;
  const request = networkOperation("preflight", "auth.openai.com", (signal) => {
    transportSignal = signal;
    return new Promise<never>(() => {});
  }, control.signal);
  control.abort();
  await assert.rejects(request, { name: "AbortError" });
  assert.equal(transportSignal?.aborted, true);
});

test("an already cancelled attempt never contacts the server", async () => {
  const control = new AbortController(); control.abort();
  let called = false;
  await assert.rejects(networkOperation("token", "auth.openai.com", async () => { called = true; }, control.signal), { name: "AbortError" });
  assert.equal(called, false);
});

test("a request that never responds has a bounded deadline and is aborted once", async () => {
  let transportSignal: AbortSignal | undefined;
  let attempts = 0;
  await assert.rejects(networkOperation("identity", "auth.openai.com", (signal) => {
    attempts++; transportSignal = signal;
    return new Promise<never>(() => {});
  }, undefined, 15), (error: unknown) => error instanceof NetworkIssue && error.kind === "timeout");
  assert.equal(transportSignal?.aborted, true);
  assert.equal(attempts, 1);
});

test("HTTP rejection is returned unchanged so callers can distinguish it from transport failure", async () => {
  const response = { status: 401, ok: false };
  assert.equal(await networkOperation("models", "api.openai.com", async () => response), response);
});

test("certificate failures are identified separately from DNS and localized", async () => {
  await assert.rejects(networkOperation("preflight", "auth.openai.com", async () => {
    throw new Error("SSLHandshakeException: CertPathValidatorException");
  }), (error: unknown) => {
    assert.ok(error instanceof NetworkIssue);
    assert.equal(error.kind, "tls");
    assert.match(connectionMessage(error, "en"), /secure connection/);
    return true;
  });
});
