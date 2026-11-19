export interface CredentialStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
}
export function createCredentialStore(
  embedded: string,
  storage: CredentialStorage,
) {
  // Old demo settings must not mask the newly supplied private-build key.
  const slot = embedded ? "mss.openai.api.private142" : "mss.openai.api.key";
  return {
    async get() {
      const override = await storage.getItem(slot);
      return override === "DISABLED" ? "" : override || embedded;
    },
    async set(value: string) {
      const clean = value.trim();
      if (clean && !/^sk-[A-Za-z0-9_-]{20,}$/.test(clean))
        throw new Error("La clave no tiene un formato válido.");
      await storage.setItem(slot, clean || "DISABLED");
    },
    async restore() {
      if (!embedded)
        throw new Error("Esta compilación no incorpora clave API.");
      await storage.deleteItem(slot);
    },
  };
}
