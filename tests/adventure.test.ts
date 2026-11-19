import test from "node:test";
import assert from "node:assert/strict";
import {
  adventureContext,
  parseBlueprint,
  commitBlueprint,
  commitChapter,
  chapterCount,
  type AdventureConfig,
  type Continuity,
} from "../src/domain/adventure";
import {
  createNovel,
  initialState,
  selectChoice,
  unlock,
  finish,
  restart,
} from "../src/domain/engine";
import { parseAdventureChapter } from "../src/services/chatgpt/adventure-protocol";
import type { GeneratedChapter } from "../src/services/chatgpt/protocol";
const memory: Continuity = {
  summary: "Alex llega a Valencia.",
  characters: ["Alex, 35 años"],
  facts: ["Alex vive en Valencia"],
  relationships: [],
  openThreads: ["La carta"],
  timeline: ["Lunes: llegada"],
};
const config: AdventureConfig = {
  totalChapters: 12,
  occupation: "Recepcionista",
  loveInterestName: "Daniel",
  loveInterestRole: "Bombero",
  loveInterestDescription: "Reservado",
  setting: "Valencia",
  plot: "Sorpréndeme",
  conflict: "Sorpréndeme",
  resolution: "Abierta a mis decisiones",
  goal: "Empezar de nuevo",
  boundaries: "Sin infidelidades",
};
const timing = {
  startedAt: new Date().toISOString(),
  totalMs: 1000,
  characters: 100,
  model: "test",
};
const planRaw = (count: number) => ({
  title: "La carta del lunes",
  synopsis: "Una llegada inesperada cambia sus planes.",
  beats: Array.from({ length: count }, (_, i) => ({
    chapter: i + 1,
    aim: `Objetivo ${i + 1}`,
  })),
  memory,
});
const novel = () => ({
  ...createNovel(
    "detective",
    {
      name: "Alex",
      gender: "woman",
      pronouns: "she",
      traits: "",
      photo: "file:///private-photo",
    },
    "romantic",
    "n",
  ),
  source: "chatgpt" as const,
  adventure: config,
});
const rawChapter = (index: number, count: number) => ({
  title: `Capítulo ${index + 1}`,
  summary: `Sucede ${index + 1}`,
  paragraphs: Array.from({ length: 10 }, (_, i) => `Párrafo ${i + 1}`),
  choices:
    index === count - 1
      ? []
      : Array.from({ length: 5 }, (_, i) => ({ label: `Acción ${i + 1}` })),
  memory: { ...memory, summary: `Memoria ${index + 1}` },
  beatUpdates: [],
});
const chapter = (index: number, count: number): GeneratedChapter => ({
  ...parseAdventureChapter(
    JSON.stringify(rawChapter(index, count)),
    index,
    count,
  ),
  timing,
  lang: "es",
});
test("12/15 chapter flexible outline requires complete ordered beats and bounded memory", () => {
  for (const count of [12, 15])
    assert.equal(
      parseBlueprint(JSON.stringify(planRaw(count)), count).beats.length,
      count,
    );
  const bad = planRaw(12);
  bad.beats[5].chapter = 4;
  assert.throws(() => parseBlueprint(JSON.stringify(bad), 12), /order/);
  assert.throws(
    () => parseBlueprint(JSON.stringify(planRaw(12)), 15),
    /length/,
  );
  assert.throws(
    () =>
      parseBlueprint(
        JSON.stringify({ ...planRaw(12), memory: { summary: "incomplete" } }),
        12,
      ),
    /continuity/,
  );
  assert.throws(
    () =>
      parseBlueprint(
        JSON.stringify({
          ...planRaw(12),
          memory: { ...memory, facts: Array(26).fill("fact") },
        }),
        12,
      ),
    /continuity/,
  );
});
test("chapters require 4–5 distinct actions, final zero, and only bounded future outline changes", () => {
  const raw = rawChapter(3, 12);
  assert.equal(
    parseAdventureChapter(JSON.stringify(raw), 3, 12).choices.length,
    5,
  );
  assert.throws(
    () =>
      parseAdventureChapter(
        JSON.stringify({ ...raw, choices: raw.choices.slice(0, 2) }),
        3,
        12,
      ),
    /decisions/,
  );
  assert.throws(
    () =>
      parseAdventureChapter(
        JSON.stringify({ ...raw, choices: Array(4).fill({ label: "Repeat" }) }),
        3,
        12,
      ),
    /repeated/,
  );
  assert.throws(
    () =>
      parseAdventureChapter(
        JSON.stringify({
          ...raw,
          beatUpdates: [{ chapter: 4, aim: "rewrite past" }],
        }),
        3,
        12,
      ),
    /future/,
  );
  assert.throws(
    () =>
      parseAdventureChapter(
        JSON.stringify({
          ...raw,
          beatUpdates: [{ chapter: 13, aim: "beyond ending" }],
        }),
        3,
        12,
      ),
    /future/,
  );
  assert.equal(
    parseAdventureChapter(JSON.stringify(rawChapter(11, 12)), 11, 12).choices
      .length,
    0,
  );
  assert.throws(
    () =>
      parseAdventureChapter(
        JSON.stringify({ ...rawChapter(11, 12), choices: raw.choices }),
        11,
        12,
      ),
    /decisions/,
  );
});
test("plan and chapter commit atomically; duplicate or late results cannot overwrite a restarted run", () => {
  const n = novel(),
    plan = {
      ...parseBlueprint(JSON.stringify(planRaw(12)), 12),
      timing,
      lang: "es" as const,
    };
  const planned = commitBlueprint(n, n.generationId, plan);
  const result = {
    ...chapter(0, 12),
    beatUpdates: [{ chapter: 4, aim: "Consecuencia de la carta" }],
  };
  const saved = commitChapter(planned, n.generationId, 0, result);
  assert.equal(saved.memory?.summary, "Memoria 1");
  assert.equal(saved.generated?.["0"], result);
  assert.equal(saved.blueprint?.beats[3].aim, "Consecuencia de la carta");
  assert.equal(planned.generated?.["0"], undefined);
  assert.equal(planned.memory?.summary, memory.summary);
  assert.throws(
    () => commitChapter(saved, n.generationId, 0, result),
    /changed/,
  );
  const reset = restart(saved);
  assert.notEqual(reset.generationId, n.generationId);
  assert.equal(reset.memory, undefined);
  assert.equal(reset.blueprint, undefined);
  assert.deepEqual(reset.generated, {});
  assert.throws(
    () => commitChapter(reset, n.generationId, 0, result),
    /changed/,
  );
  assert.throws(() => commitBlueprint(reset, n.generationId, plan), /changed/);
});
for (const count of [12, 15] as const)
  test(`${count} chapters advance beyond chapter 3 and close only at the chosen length`, () => {
    let s = initialState();
    s.wallet.premium = true;
    const n = { ...novel(), adventure: { ...config, totalChapters: count } };
    s.novels = [
      commitBlueprint(n, n.generationId, {
        ...parseBlueprint(JSON.stringify(planRaw(count)), count),
        timing,
        lang: "es",
      }),
    ];
    for (let i = 0; i < count; i++) {
      s.novels[0] = commitChapter(
        s.novels[0],
        n.generationId,
        i,
        chapter(i, count),
      );
      if (i < count - 1) {
        assert.throws(() => finish(s.novels[0]), /CHAPTER/);
        assert.throws(
          () =>
            selectChoice(s.novels[0], { id: "forged", trust: 0, courage: 0 }),
          /DECISION/,
        );
        s = unlock(s, "n");
        const choice = s.novels[0].generated![String(i)].choices[3];
        s.novels[0] = selectChoice(s.novels[0], {
          ...choice,
          label: { es: choice.label, en: choice.label },
        });
      }
    }
    const done = finish(s.novels[0]);
    assert.equal(done.completed, true);
    assert.equal(done.decisions.length, count - 1);
    assert.equal(chapterCount(done), count);
    assert.equal(s.wallet.credits, 12);
    assert.deepEqual(restart(done).unlocked, [0]);
    const ctx = adventureContext(done, "es");
    assert.equal("photo" in ctx.profile, false);
    assert.equal(ctx.lastDecision?.label, "Acción 4");
    assert.ok(ctx.lastChapter?.endingParagraphs.length === 3);
  });

test('three trial chapters are free; chapter four requires demo Premium without spending legacy credits',()=>{
 const s=initialState();s.novels=[novel()];s.wallet.credits=0;
 let next=unlock(s,'n');assert.deepEqual(next.novels[0].unlocked,[0,1]);assert.equal(next.wallet.credits,0);
 next.novels[0]={...next.novels[0],chapter:1};next=unlock(next,'n');assert.deepEqual(next.novels[0].unlocked,[0,1,2]);
 next.novels[0]={...next.novels[0],chapter:2};assert.throws(()=>unlock(next,'n'),/PREMIUM/);assert.equal(next.novels[0].chapter,2);assert.equal(next.wallet.credits,0);
 next.wallet.premium=true;assert.deepEqual(unlock(next,'n').novels[0].unlocked,[0,1,2,3]);
});
