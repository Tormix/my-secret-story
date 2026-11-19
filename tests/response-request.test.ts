import test from "node:test";
import assert from "node:assert/strict";
import {
  responseRequest,
  responseError,
} from "../src/services/openai/response-request";
test("real HTTP400 regression: JSON mode includes explicit JSON instruction in input messages", () => {
  const input = [{ role: "user", content: '{"profile":{"name":"Laura"}}' }];
  const body = responseRequest("gpt-6.1-sol", input, "Return valid JSON.");
  assert.match(JSON.stringify(body.input), /JSON/);
  assert.deepEqual(body.input.at(-1), input[0]);
  assert.equal(body.text?.format.type, "json_object");
  assert.deepEqual(body.reasoning, { effort: "low" });
  assert.equal(body.store, false);
  assert.equal(body.stream, true);
  assert.equal(input.length, 1);
});
test("plain connection probes preserve messages and do not activate JSON mode", () => {
  const input = [{ role: "user", content: "Hola" }];
  const body = responseRequest("gpt-4.1", input, "Responde en español.", false);
  assert.deepEqual(body.input, input);
  assert.equal("text" in body, false);
  assert.equal("reasoning" in body, false);
});
test("API errors identify the rejected parameter and do not blame a valid key", () => {
  const text = responseError(400, {
    error: {
      type: "invalid_request_error",
      param: "input",
      message: "Response input messages must contain the word 'json'.",
    },
  });
  assert.match(text, /input/);
  assert.match(text, /must contain the word/);
  assert.doesNotMatch(text, /saldo|permisos|Revisa clave/);
});
test("API diagnostics redact the supplied key and other key-shaped values", () => {
  const secret = "sk-" + "placeholder".repeat(4);
  const text = responseError(
    401,
    {
      error: {
        message: `Invalid ${secret}; sk-anotherplaceholderkeyvalue`,
        param: secret,
      },
    },
    secret,
  );
  assert.ok(!text.includes(secret));
  assert.ok(!text.includes("sk-anotherplaceholderkeyvalue"));
  assert.match(text, /clave oculta/);
});
