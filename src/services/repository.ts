import * as SQLite from "expo-sqlite";
import type { AppState } from "../domain/types";
import { initialState } from "../domain/engine";
import { schema } from "./schema";
export interface Repository {
  load(): Promise<AppState>;
  save(state: AppState): Promise<void>;
}
export class SQLiteRepository implements Repository {
  private db: SQLite.SQLiteDatabase | null = null;
  private async open() {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync("storymuse.db");
      await this.db.execAsync(schema);
    }
    return this.db;
  }
  async load() {
    const db = await this.open();
    const row = await db.getFirstAsync<{ json: string }>(
      "SELECT json FROM app_state WHERE id=1",
    );
    if (!row) return initialState();
    const state = JSON.parse(row.json) as AppState;
    if (state.version !== 1) throw new Error("Unsupported data version");
    return state;
  }
  async save(state: AppState) {
    const db = await this.open();
    await db.withExclusiveTransactionAsync(async (tx) => {
      await tx.runAsync(
        "INSERT OR REPLACE INTO app_state(id,json) VALUES(1,?)",
        JSON.stringify(state),
      );
      await tx.runAsync("DELETE FROM novels");
      for (const n of state.novels)
        await tx.runAsync(
          "INSERT INTO novels(id,universe,chapter,updated_at,json) VALUES(?,?,?,?,?)",
          n.id,
          n.universe,
          n.chapter,
          n.updatedAt,
          JSON.stringify(n),
        );
    });
  }
}
export const repository: Repository = new SQLiteRepository();
