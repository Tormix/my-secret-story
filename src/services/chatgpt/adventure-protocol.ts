import { applyMemoryDelta } from "../../domain/memory-delta";
import type { Continuity } from "../../domain/adventure";
import { jsonObject, parseMemory } from "../../domain/adventure";
import type { GeneratedChapter } from "./protocol";
export function parseAdventureChapter(
  raw: string,
  chapter: number,
  total: number,
  previous?: Continuity,
): Omit<GeneratedChapter, "timing" | "lang"> {
  const o = jsonObject(raw);
  if (
    typeof o.title !== "string" ||
    !o.title.trim() ||
    o.title.length > 140 ||
    typeof o.summary !== "string" ||
    !o.summary.trim() ||
    o.summary.length > 2500 ||
    !Array.isArray(o.paragraphs) ||
    o.paragraphs.length < 5 ||
    o.paragraphs.length > 30 ||
    o.paragraphs.some(
      (p) => typeof p !== "string" || !p.trim() || p.length > 5000,
    )
  )
    throw new Error("Invalid adventure chapter");
  const final = chapter === total - 1;
  if (
    !Array.isArray(o.choices) ||
    (final
      ? o.choices.length !== 0
      : o.choices.length < 4 || o.choices.length > 5)
  )
    throw new Error("Expected four or five decisions");
  const labels = new Set<string>();
  const choices = o.choices.map((c: unknown, i: number) => {
    const label =
      c && typeof c === "object" ? (c as { label?: unknown }).label : undefined;
    if (
      typeof label !== "string" ||
      !label.trim() ||
      label.length > 220 ||
      labels.has(label.trim())
    )
      throw new Error("Invalid or repeated decision");
    labels.add(label.trim());
    return {
      id: `adventure-${chapter}-${i}`,
      label: label.trim(),
      trust: 0,
      courage: 0,
    };
  });
  let beatUpdates: { chapter: number; aim: string }[] = [];
  if (o.beatUpdates !== undefined) {
    if (!Array.isArray(o.beatUpdates) || o.beatUpdates.length > 3)
      throw new Error("Invalid outline adjustment");
    const seen = new Set<number>();
    beatUpdates = o.beatUpdates.map((b: { chapter: number; aim: string }) => {
      if (
        !Number.isInteger(b.chapter) ||
        b.chapter <= chapter + 1 ||
        b.chapter > total ||
        seen.has(b.chapter) ||
        typeof b.aim !== "string" ||
        !b.aim.trim() ||
        b.aim.length > 500
      )
        throw new Error("Invalid future beat");
      seen.add(b.chapter);
      return { chapter: b.chapter, aim: b.aim.trim() };
    });
  }
  return {
    title: o.title.trim(),
    summary: o.summary.trim(),
    paragraphs: o.paragraphs as string[],
    choices,
    memory:
      o.memoryDelta !== undefined && previous
        ? applyMemoryDelta(previous, o.summary.trim(), o.memoryDelta)
        : parseMemory(o.memory),
    beatUpdates,
  };
}
