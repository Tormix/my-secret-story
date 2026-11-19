import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  initialState,
  createNovel,
  unlock,
  selectChoice,
  finish,
  restart,
} from "../src/domain/engine";
import { LocalNarrativeProvider } from "../src/services/narrative";
import { stories } from "../src/data/catalog";
import { schema } from "../src/services/schema";
const provider = new LocalNarrativeProvider();
for (const story of stories)
  for (const first of [0, 1])
    for (const last of [0, 1])
      test(`${story.id}: branch ${first}/${last}, both languages`, () => {
        let state = initialState();
        state.novels = [
          createNovel(
            story.id,
            { name: "Alex", gender: "nonbinary", pronouns: "they", traits: "" },
            "intense",
            "n",
          ),
        ];
        for (let i = 0; i < 3; i++) {
          for (const lang of ["es", "en"] as const) {
            const chapter = provider.chapter(state.novels[0], lang);
            assert.equal(chapter.number, i);
            assert.ok(chapter.paragraphs.join(" ").split(/\s+/).length >= 180);
            assert.ok(chapter.paragraphs.join(" ").includes("Alex"));
            assert.ok(!/\{\w+\}/.test(chapter.paragraphs.join(" ")));
          }
          if (i < 2) {
            state = unlock(state, "n");
            state.novels[0] = selectChoice(
              state.novels[0],
              story.choices[i as 0 | 1][i === 0 ? first : last],
            );
          }
        }
        const n = finish(state.novels[0]);
        assert.equal(n.completed, true);
        assert.equal(n.endings[0], last === 0 ? "together" : "apart");
        assert.equal(state.wallet.credits, 6);
        assert.equal(n.decisions.length, 2);
        assert.equal(restart(n).chapter, 0);
        assert.deepEqual(restart(n).endings, n.endings);
      });
test("branch chapters and endings are substantively different", () => {
  for (const s of stories) {
    assert.notEqual(s.chapters.together.es, s.chapters.solo.es);
    assert.notEqual(s.chapters.endingTogether.es, s.chapters.endingApart.es);
  }
});
test("credits fail atomically and cannot charge twice", () => {
  let s = initialState();
  s.novels = [
    createNovel("chef", { ...s.profile, name: "Juan" }, "romantic", "n"),
  ];
  s.wallet.credits = 2;
  assert.throws(() => unlock(s, "n"), /CREDITS/);
  assert.equal(s.novels[0].unlocked.length, 1);
  s.wallet.credits = 3;
  const unlocked = unlock(s, "n");
  assert.equal(unlock(unlocked, "n").wallet.credits, 0);
  assert.throws(
    () => selectChoice(s.novels[0], stories[4].choices[0][0]),
    /LOCKED/,
  );
});
test("adult profile validation", () => {
  assert.throws(
    () =>
      createNovel(
        "chef",
        { ...initialState().profile, name: "a", age: 17 },
        "romantic",
        "n",
      ),
    /AGE/,
  );
  assert.throws(
    () =>
      createNovel(
        "chef",
        { ...initialState().profile, name: "   " },
        "romantic",
        "n",
      ),
    /NAME/,
  );
});
test("SQLite schema persists profile, decisions and media references across reopen", () => {
  const dir = mkdtempSync(join(tmpdir(), "storymuse-")),
    file = join(dir, "state.db");
  try {
    const state = initialState();
    state.profile = {
      ...state.profile,
      name: "Alex",
      photo: "file:///private/photo.jpg",
    };
    state.novels = [createNovel("detective", state.profile, "sensual", "n")];
    const db = new DatabaseSync(file);
    db.exec(schema);
    db.prepare("INSERT INTO app_state(id,json) VALUES(1,?)").run(
      JSON.stringify(state),
    );
    db.close();
    const reopened = new DatabaseSync(file);
    const row = reopened
      .prepare("SELECT json FROM app_state WHERE id=1")
      .get() as { json: string };
    assert.deepEqual(JSON.parse(row.json), state);
    assert.equal(
      reopened.prepare("PRAGMA user_version").get()?.user_version,
      1,
    );
    reopened.close();
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test("new profile context survives serialization and restarting preserves it while resetting the reader", () => {
  const profile = {
    ...initialState().profile,
    name: "Alex",
    lifeDetails: "Valencia y cocinar",
    tone: "mysterious" as const,
    protagonistMode: "fictional" as const,
  };
  const novel = createNovel("chef", profile, "romantic", "personal");
  const saved = JSON.parse(
    JSON.stringify({ ...novel, readingChapter: 2, scroll: { "2": 750 } }),
  );
  assert.deepEqual(saved.profile, profile);
  const reset = restart(saved);
  assert.deepEqual(reset.profile, profile);
  assert.equal(reset.readingChapter, 0);
  assert.deepEqual(reset.scroll, {});
});
