import test from "node:test";
import assert from "node:assert/strict";
import {
  authUrl,
  callback,
  EventStream,
  parseChapter,
} from "../src/services/chatgpt/protocol";
test("OAuth requests official endpoint, PKCE and explicit plan permission", () => {
  const u = new URL(
    authUrl({
      state: "s",
      nonce: "n",
      challenge: "c",
      redirect: "http://127.0.0.1:1234/auth/callback",
      hostId: "urn:uuid:abc",
    }),
  );
  assert.equal(u.origin, "https://auth.openai.com");
  assert.equal(u.searchParams.get("client_id"), "dynamic_agent_client");
  assert.equal(u.searchParams.get("code_challenge_method"), "S256");
  assert.match(u.searchParams.get("scope")!, /chatgpt.tokens.use.direct/);
  assert.equal(u.searchParams.get("agent_name_hint"), "My Secret Story");
});
test("OAuth rejects mismatched state, swapped clients and missing issued registration", () => {
  assert.throws(() =>
    callback(
      "http://127.0.0.1/auth/callback?code=x&state=bad&client_id=oaiapp_a",
      "s",
    ),
  );
  assert.throws(() =>
    callback(
      "http://127.0.0.1/auth/callback?code=x&state=s&client_id=oaiapp_b",
      "s",
      "oaiapp_a",
    ),
  );
  assert.throws(() =>
    callback("http://127.0.0.1/auth/callback?code=x&state=s", "s"),
  );
  assert.throws(() =>
    callback("http://127.0.0.1/auth/callback?error=access_denied&state=s", "s"),
  );
  assert.deepEqual(
    callback(
      "http://127.0.0.1/auth/callback?code=x&state=s&client_id=oaiapp_a",
      "s",
    ),
    { clientId: "oaiapp_a", code: "x" },
  );
});
test("SSE handles chunk boundaries and requires terminal completion", () => {
  let text = "";
  const stream = new EventStream((d) => (text += d));
  const source =
    'data: {"type":"response.output_text.delta","delta":"Hola á"}\r\n\r\ndata: {"type":"response.completed","response":{}}\r\n\r\n';
  for (const ch of source) stream.push(ch);
  assert.equal(stream.finish(), "Hola á");
  assert.equal(text, "Hola á");
  const interrupted = new EventStream();
  interrupted.push(
    'data: {"type":"response.output_text.delta","delta":"partial"}\n\n',
  );
  assert.throws(() => interrupted.finish(), /interrupted/);
});
test("late usage failures reject partial content", () => {
  const s = new EventStream();
  s.push('data: {"type":"response.output_text.delta","delta":"partial"}\n\n');
  assert.throws(
    () =>
      s.push(
        'data: {"type":"response.failed","response":{"error":{"code":"subscription_sharing_usage_limit_exceeded"}}}\n\n',
      ),
    /subscription_sharing_usage_limit_exceeded/,
  );
});
test("AI chapter validation rejects malformed content, fixes safe choice ids and effects", () => {
  const chapter = {
    title: "Test",
    summary: "Continuity",
    paragraphs: ["one", "two", "three", "four", "five"],
    choices: [{ label: "Together" }, { label: "Alone" }],
  };
  const parsed = parseChapter(JSON.stringify(chapter), 0);
  assert.equal(parsed.choices[0].id, "ai-0-0");
  assert.equal(parsed.choices[1].trust, 0);
  assert.throws(() => parseChapter(JSON.stringify(chapter), 2));
  assert.throws(() => parseChapter('{"title":"bad"}', 0));
});
