import type { Novel, Lang } from "./types";
import type { Timing } from "../services/chatgpt/protocol";
export interface AdventureConfig {
  templateId?: string;
  milestones?: { chapter: number; aim: string }[];
  totalChapters: 12 | 15;
  occupation: string;
  loveInterestName: string;
  loveInterestRole: string;
  loveInterestDescription: string;
  setting: string;
  plot: string;
  conflict: string;
  resolution: string;
  goal: string;
  boundaries: string;
}
export interface Continuity {
  summary: string;
  characters: string[];
  facts: string[];
  relationships: string[];
  openThreads: string[];
  timeline: string[];
}
export interface Blueprint {
  title: string;
  synopsis: string;
  beats: { chapter: number; aim: string }[];
  memory: Continuity;
  timing: Timing;
  lang: Lang;
}
export const plotOptions = [
  "Sorpréndeme",
  "Segunda oportunidad",
  "Rivales que se atraen",
  "Encuentro inesperado",
  "Un secreto compartido",
  "Una nueva vida",
];
export const conflictOptions = [
  "Sorpréndeme",
  "Objetivos incompatibles",
  "Distancia y responsabilidades",
  "Un secreto del pasado",
  "Desconfianza inicial",
  "Una decisión profesional",
];
export const resolutionOptions = [
  "Abierta a mis decisiones",
  "Una relación construida entre ambos",
  "Elegir mi independencia",
  "Un nuevo comienzo",
  "Una reconciliación posible",
];
export const chapterCount = (n: Novel): number =>
  n.adventure?.totalChapters ?? 3;
export function jsonObject(raw: string): Record<string, unknown> {
  const value = JSON.parse(
    raw
      .trim()
      .replace(/^```(?:json)?\s*/, "")
      .replace(/\s*```$/, ""),
  );
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid narrative JSON");
  return value;
}
function str(value: unknown, max: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error("Invalid narrative field");
  return value.trim();
}
export function parseMemory(value: unknown): Continuity {
  if (!value || typeof value !== "object")
    throw new Error("Missing continuity memory");
  const o = value as Record<string, unknown>;
  const list = (key: string, count: number) => {
    const v = o[key];
    if (!Array.isArray(v) || v.length > count)
      throw new Error("Invalid continuity list");
    return v.map((x) => str(x, 600));
  };
  return {
    summary: str(o.summary, 2500),
    characters: list("characters", 12),
    facts: list("facts", 25),
    relationships: list("relationships", 12),
    openThreads: list("openThreads", 15),
    timeline: list("timeline", 20),
  };
}
export function parseBlueprint(
  raw: string,
  count: number,
): Omit<Blueprint, "timing" | "lang"> {
  const o = jsonObject(raw);
  if (!Array.isArray(o.beats) || o.beats.length !== count)
    throw new Error("Invalid outline length");
  return {
    title: str(o.title, 140),
    synopsis: str(o.synopsis, 1400),
    beats: o.beats.map((b: unknown, i: number) => {
      if (
        !b ||
        typeof b !== "object" ||
        (b as { chapter?: number }).chapter !== i + 1
      )
        throw new Error("Invalid outline order");
      return { chapter: i + 1, aim: str((b as { aim?: unknown }).aim, 500) };
    }),
    memory: parseMemory(o.memory),
  };
}
export function adventureContext(n: Novel, lang: Lang) {
  const { photo: _photo, ...profile } = n.profile;
  void _photo;
  return {
    profile,
    configuration: n.adventure,
    intensity: n.intensity,
    language: lang,
    chapter: n.chapter + 1,
    blueprint: n.blueprint
      ? {
          title: n.blueprint.title,
          synopsis: n.blueprint.synopsis,
          beats: n.blueprint.beats,
        }
      : undefined,
    memory: n.memory ?? n.blueprint?.memory,
    lastDecision: n.decisions.at(-1),
    lastChapter: n.generated?.[String(n.chapter - 1)]
      ? {
          title: n.generated[String(n.chapter - 1)].title,
          summary: n.generated[String(n.chapter - 1)].summary,
          endingParagraphs:
            n.generated[String(n.chapter - 1)].paragraphs.slice(-3),
        }
      : undefined,
  };
}
export function commitBlueprint(
  current: Novel,
  expectedGeneration: string | undefined,
  plan: Blueprint,
): Novel {
  if (
    current.generationId !== expectedGeneration ||
    current.chapter !== 0 ||
    current.blueprint
  )
    throw new Error("Story changed; reopen it before generating.");
  return {
    ...current,
    blueprint: plan,
    memory: plan.memory,
    updatedAt: new Date().toISOString(),
  };
}
export function commitChapter(
  current: Novel,
  expectedGeneration: string | undefined,
  index: number,
  result: import("../services/chatgpt/protocol").GeneratedChapter,
): Novel {
  if (
    current.generationId !== expectedGeneration ||
    current.chapter !== index ||
    current.generated?.[String(index)] ||
    !current.blueprint ||
    !result.memory
  )
    throw new Error("Story changed; reopen it before generating.");
  const beats = current.blueprint.beats.map(
    (b) => result.beatUpdates?.find((u) => u.chapter === b.chapter) ?? b,
  );
  return {
    ...current,
    generated: { ...current.generated, [String(index)]: result },
    memory: result.memory,
    blueprint: { ...current.blueprint, beats },
    updatedAt: new Date().toISOString(),
  };
}
