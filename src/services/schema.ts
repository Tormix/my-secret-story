export const schema = `PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS app_state(id INTEGER PRIMARY KEY CHECK(id=1), json TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS novels(id TEXT PRIMARY KEY, universe TEXT NOT NULL, chapter INTEGER NOT NULL, updated_at TEXT NOT NULL, json TEXT NOT NULL);
PRAGMA user_version=1;`;
