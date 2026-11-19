import test from "node:test";
import assert from "node:assert/strict";
import { prepareAdventure } from "../src/services/preparation";
import { createNovel, initialState } from "../src/domain/engine";
import type { Blueprint } from "../src/domain/adventure";
import type { GeneratedChapter } from "../src/services/chatgpt/protocol";
const memory = {
  summary: "Inicio",
  characters: [],
  facts: [],
  relationships: [],
  openThreads: [],
  timeline: [],
};
const timing = {
  startedAt: "2026-11-09",
  totalMs: 1,
  characters: 1,
  model: "fixture",
};
const plan: Blueprint = {
  title: "Prueba",
  synopsis: "Una aventura",
  beats: [],
  memory,
  timing,
  lang: "es",
};
const chapter: GeneratedChapter = {
  title: "Uno",
  paragraphs: ["Texto"],
  summary: "Inicio",
  choices: [],
  memory,
  timing,
  lang: "es",
};
const novel = () =>
  createNovel(
    "firefighter",
    { ...initialState().profile, name: "Laura", age: 38 },
    "romantic",
    "prepare-test",
  );
function deferred<T>() {
  let resolve!: (x: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
test("cover is offered before a slow chapter and both requests start without waiting", async () => {
  const pending = deferred<GeneratedChapter>(),
    coverSaved = deferred<void>(),
    events: string[] = [];
  let finished = false;
  const operation = prepareAdventure(novel(), {
    cover: {
      generate: async () => {
        events.push("cover-start");
        return "file://new-scene.png";
      },
      save: async (uri) => {
        events.push(uri);
        coverSaved.resolve();
      },
      failed: (e) => {
        throw e;
      },
      settled: () => {},
    },
    text: {
      blueprint: async () => {
        events.push("outline-start");
        return plan;
      },
      saveBlueprint: async () => {},
      chapter: async () => pending.promise,
      saveChapter: async () => {
        events.push("chapter-saved");
      },
      phase: () => {},
      failed: (e) => {
        throw e;
      },
      settled: () => {},
    },
  }).then(() => {
    finished = true;
  });
  await coverSaved.promise;
  assert.ok(events.includes("outline-start"));
  assert.ok(events.includes("file://new-scene.png"));
  assert.equal(finished, false);
  assert.ok(!events.includes("chapter-saved"));
  pending.resolve(chapter);
  await operation;
  assert.equal(finished, true);
});
test("chapter failure preserves completed cover and reports the text failure independently", async () => {
  let saved = false,
    failure = "";
  await prepareAdventure(novel(), {
    cover: {
      generate: async () => "cover",
      save: async () => {
        saved = true;
      },
      failed: (e) => {
        throw e;
      },
      settled: () => {},
    },
    text: {
      blueprint: async () => plan,
      saveBlueprint: async () => {},
      chapter: async () => {
        throw Error("HTTP 400");
      },
      saveChapter: async () => {
        assert.fail();
      },
      phase: () => {},
      failed: (e) => {
        failure = String(e);
      },
      settled: () => {},
    },
  });
  assert.equal(saved, true);
  assert.match(failure, /HTTP 400/);
});
test("resuming a saved outline skips its API call and uses its memory for the chapter", async () => {
  const n = { ...novel(), blueprint: plan, memory };
  let saved = false;
  await prepareAdventure(n, {
    text: {
      blueprint: async () => {
        assert.fail("outline regenerated");
        return plan;
      },
      saveBlueprint: async () => {
        assert.fail();
      },
      chapter: async (working) => {
        assert.equal(working.blueprint, plan);
        return chapter;
      },
      saveChapter: async () => {
        saved = true;
      },
      phase: () => {},
      failed: (e) => {
        throw e;
      },
      settled: () => {},
    },
  });
  assert.equal(saved, true);
});
test("cancellation prevents a late cover response from being saved", async () => {
  const control = new AbortController(),
    pending = deferred<string>();
  let saved = false;
  const operation = prepareAdventure(
    novel(),
    {
      cover: {
        generate: () => pending.promise,
        save: async () => {
          saved = true;
        },
        failed: () => {
          assert.fail();
        },
        settled: () => {},
      },
    },
    control.signal,
  );
  control.abort();
  pending.resolve("late-cover");
  await operation;
  assert.equal(saved, false);
});
