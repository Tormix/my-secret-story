import test from "node:test";
import assert from "node:assert/strict";
import { ParagraphStream } from "../src/services/chatgpt/paragraph-stream";
import { catalogBlueprint } from "../src/domain/catalog-blueprint";
import { applyMemoryDelta } from "../src/domain/memory-delta";
import { templates } from "../src/data/templates";
import { initialState, createNovel } from "../src/domain/engine";
import type { Continuity } from "../src/domain/adventure";
const memory: Continuity = {
  summary: "Inicio",
  characters: ["Laura, 38"],
  facts: ["Vive en Valencia"],
  relationships: ["Desconfianza"],
  openThreads: ["La carta"],
  timeline: ["Lunes"],
};
test("completed paragraphs arrive before the rest of JSON; quotes, accents, escapes and emoji survive arbitrary chunks", () => {
  const stream = new ParagraphStream(),
    paragraphs = ['Digo: "hola". 😊', "Una línea\ny otra. Ruta C:\\casa."];
  const raw = JSON.stringify({
    title: "Capítulo",
    paragraphs,
    summary: "SECRETO",
    choices: [{ label: "Elegir" }],
  });
  let firstAt = 0;
  for (let i = 0; i < raw.length; i++) {
    const result = stream.push(raw[i]);
    if (result.length && !firstAt) firstAt = i;
  }
  assert.deepEqual(stream.paragraphs, paragraphs);
  assert.ok(firstAt < raw.indexOf('"summary"'));
  assert.ok(!stream.paragraphs.join().includes("SECRETO"));
});
test("nested paragraph keys and unfinished strings cannot leak into the reading preview", () => {
  const stream = new ParagraphStream();
  assert.deepEqual(
    stream.push(
      '{"metadata":{"paragraphs":["hidden"]},"paragraphs":["Un párrafo incompleto',
    ),
    [],
  );
  assert.deepEqual(stream.push(' que ya termina",'), [
    "Un párrafo incompleto que ya termina",
  ]);
  assert.deepEqual(stream.push('"Otro"],"summary":"hidden"}'), [
    "Un párrafo incompleto que ya termina",
    "Otro",
  ]);
});
test("catalog prepares all ten 15-chapter outlines without an API model, preserving milestones and reader occupation", () => {
  for (const t of templates) {
    const novel = {
      ...createNovel(
        t.id,
        {
          ...initialState().profile,
          name: "Laura",
          occupation: "Recepcionista",
          age: 38,
        },
        "romantic",
        "fixed",
      ),
      adventure: {
        templateId: t.id,
        totalChapters: 15 as const,
        occupation: "Recepcionista",
        loveInterestName: t.person,
        loveInterestRole: t.role,
        loveInterestDescription: "Adulto",
        setting: t.setting,
        plot: t.hook,
        conflict: t.conflict,
        resolution: t.ending,
        goal: t.title,
        boundaries: "",
        milestones: t.milestones,
      },
    };
    const plan = catalogBlueprint(novel, "es");
    assert.equal(plan.beats.length, 15);
    assert.equal(plan.timing.model, "catalog-local");
    assert.equal(plan.timing.outputTokens, 0);
    assert.equal(plan.title, t.title);
    assert.match(plan.memory.characters[0], /Recepcionista/);
    for (const beat of t.milestones)
      assert.equal(plan.beats[beat.chapter - 1].aim, beat.aim);
  }
});
test("continuity delta preserves facts, resolves a thread and replaces an obsolete relationship", () => {
  const result = applyMemoryDelta(memory, "La carta se aclara", {
    add: {
      facts: ["La carta era de Daniel"],
      relationships: ["Confianza inicial"],
    },
    remove: { openThreads: [0], relationships: [0] },
  });
  assert.deepEqual(result.facts, [
    "Vive en Valencia",
    "La carta era de Daniel",
  ]);
  assert.deepEqual(result.openThreads, []);
  assert.deepEqual(result.relationships, ["Confianza inicial"]);
  assert.deepEqual(memory.relationships, ["Desconfianza"]);
});
test("empty changes retain continuity; repeated facts are not duplicated", () => {
  assert.deepEqual(
    applyMemoryDelta(memory, "Nuevo resumen", {}).facts,
    memory.facts,
  );
  assert.equal(
    applyMemoryDelta(memory, "Nuevo resumen", {
      add: { facts: ["Vive en Valencia"] },
    }).facts.length,
    1,
  );
});
test("invalid removals, immutable fact deletion and unbounded metadata are rejected", () => {
  for (const delta of [
    { remove: { facts: [0] } },
    { remove: { openThreads: [9] } },
    { add: { facts: ["a", "b", "c"] } },
    { add: { unknown: ["x"] } },
  ])
    assert.throws(() => applyMemoryDelta(memory, "Resumen", delta));
});
