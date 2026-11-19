import test from "node:test";
import assert from "node:assert/strict";
import { imageRequest } from "../src/services/openai/image-request";
test("description-only covers never attach an image", () => {
  const r = imageRequest("adult romance");
  assert.equal(r.url, "https://api.openai.com/v1/images/generations");
  assert.equal("images" in r.body, false);
});
test("photo covers use edits and the selected inline reference, without unsupported fidelity", () => {
  const photo = "data:image/jpeg;base64,YQ==",
    r = imageRequest("preserve face", photo);
  assert.equal(r.url, "https://api.openai.com/v1/images/edits");
  assert.deepEqual(r.body.images, [{ image_url: photo }]);
  assert.equal(r.body.model, "gpt-image-2");
  assert.equal("input_fidelity" in r.body, false);
});
test("external URLs, non-images and oversized photos are rejected before transport", () => {
  for (const photo of [
    "file:///private/photo.jpg",
    "https://example.com/photo.png",
    "data:text/plain;base64,YQ==",
    "data:image/jpeg;base64," + "a".repeat(14_000_000),
  ])
    assert.throws(() => imageRequest("romance", photo));
});
