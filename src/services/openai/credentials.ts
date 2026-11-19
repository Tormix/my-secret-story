import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { EMBEDDED_API_KEY } from "../../config/embedded-key";
import { createCredentialStore } from "./credential-store";
const web = new Map<string, string>(); // Browser preview: memory only.
const credentials = createCredentialStore(
  EMBEDDED_API_KEY,
  Platform.OS === "web"
    ? {
        getItem: async (key) => web.get(key) ?? null,
        setItem: async (key, value) => {
          web.set(key, value);
        },
        deleteItem: async (key) => {
          web.delete(key);
        },
      }
    : {
        getItem: (key) => SecureStore.getItemAsync(key),
        setItem: (key, value) => SecureStore.setItemAsync(key, value),
        deleteItem: (key) => SecureStore.deleteItemAsync(key),
      },
);
export const getApiKey = credentials.get;
export const setApiKey = credentials.set;
export const restoreEmbeddedKey = credentials.restore;
export const hasEmbeddedKey = Boolean(EMBEDDED_API_KEY);
export async function requireApiKey() {
  const key = await getApiKey();
  if (!key)
    throw new Error(
      "Falta la clave API. En Ajustes pulsa «Usar la clave integrada de la demo» o configura tu clave.",
    );
  return key;
}
