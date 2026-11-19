import test from "node:test";
import assert from "node:assert/strict";
import { createCredentialStore } from "../src/services/openai/credential-store";
const embedded = "sk-" + "demo-placeholder".repeat(3);
function setup(legacy?: string, integrated = embedded) {
  const values = new Map(legacy ? [["mss.openai.api.key", legacy]] : []);
  const store = createCredentialStore(integrated, {
    getItem: async (k) => values.get(k) ?? null,
    setItem: async (k, v) => {
      values.set(k, v);
    },
    deleteItem: async (k) => {
      values.delete(k);
    },
  });
  return { values, store };
}
test("private upgrade uses embedded key despite an old disabled marker or old override", async () => {
  for (const legacy of [undefined, "DISABLED", "sk-old-account-key"]) {
    const { store } = setup(legacy);
    assert.equal(await store.get(), embedded);
  }
});
test("explicit disable in new private demo is respected and restore reactivates embedded key", async () => {
  const { store } = setup("DISABLED");
  await store.set("");
  assert.equal(await store.get(), "");
  await store.restore();
  assert.equal(await store.get(), embedded);
});
test("replacement key can be restored without modifying story/profile data", async () => {
  const { store, values } = setup();
  values.set("profile", "reader-photo");
  const replacement = "sk-" + "replacement".repeat(3);
  await store.set(replacement);
  assert.equal(await store.get(), replacement);
  await store.restore();
  assert.equal(await store.get(), embedded);
  assert.equal(values.get("profile"), "reader-photo");
});
test("source build without embedded key preserves manually configured legacy credentials", async () => {
  const { store } = setup(embedded, "");
  assert.equal(await store.get(), embedded);
  await assert.rejects(store.restore(), /no incorpora/);
});
