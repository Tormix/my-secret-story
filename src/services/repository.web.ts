// Browser QA adapter only. Android always resolves repository.ts and expo-sqlite.
import { initialState } from "../domain/engine";
import type { AppState } from "../domain/types";
export const repository = {
  async load(): Promise<AppState> {
    const raw = localStorage.getItem("storymuse.qa.v1");
    return raw ? JSON.parse(raw) : initialState();
  },
  async save(state: AppState) {
    localStorage.setItem("storymuse.qa.v1", JSON.stringify(state));
  },
};
