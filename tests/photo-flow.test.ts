import test from "node:test";
import assert from "node:assert/strict";
import { captureProfilePhoto } from "../src/services/photo-flow";
import { applyMemoryDelta } from "../src/domain/memory-delta";
test("denied camera permission never launches the camera or saves a photo", async () => {
  let launched = 0,
    kept = 0;
  await assert.rejects(
    () =>
      captureProfilePhoto({
        permission: async () => ({ granted: false, canAskAgain: true }),
        launch: async () => {
          launched++;
          return { canceled: false, assets: [{ uri: "camera" }] };
        },
        keep: () => {
          kept++;
          return "saved";
        },
      }),
    /galería o seguir sin foto/,
  );
  assert.equal(launched, 0);
  assert.equal(kept, 0);
});
test("cancelling the camera preserves the previous photo by returning no replacement", async () => {
  let kept = 0;
  const result = await captureProfilePhoto({
    permission: async () => ({ granted: true, canAskAgain: true }),
    launch: async () => ({ canceled: true, assets: null }),
    keep: () => {
      kept++;
      return "saved";
    },
  });
  assert.equal(result, undefined);
  assert.equal(kept, 0);
});
test("successful camera capture is copied to a persistent private path", async () => {
  let permission = false;
  const result = await captureProfilePhoto({
    permission: async () => {
      permission = true;
      return { granted: true, canAskAgain: true };
    },
    launch: async () => {
      assert.equal(permission, true);
      return {
        canceled: false,
        assets: [{ uri: "cache/photo.jpg", mimeType: "image/jpeg" }],
      };
    },
    keep: (asset) => {
      assert.equal(asset.uri, "cache/photo.jpg");
      return "file:///private/photo.jpg";
    },
  });
  assert.equal(result, "file:///private/photo.jpg");
});
test("final chapter can resolve all fifteen open threads without discarding immutable facts", () => {
  const previous = {
    summary: "Antes",
    characters: ["Ana adulta"],
    facts: ["Hecho estable"],
    relationships: ["Se conocen"],
    openThreads: Array.from({ length: 15 }, (_, i) => `Hilo ${i}`),
    timeline: [],
  };
  const next = applyMemoryDelta(previous, "Final", {
    remove: { openThreads: Array.from({ length: 15 }, (_, i) => i) },
  });
  assert.deepEqual(next.openThreads, []);
  assert.deepEqual(next.facts, previous.facts);
  assert.throws(() =>
    applyMemoryDelta(previous, "Final", { remove: { openThreads: [1, 1] } }),
  );
});
