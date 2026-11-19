import { parseMemory, type Continuity } from "./adventure";
const keys = [
  "characters",
  "facts",
  "relationships",
  "openThreads",
  "timeline",
] as const;
type Key = (typeof keys)[number];
const limits: Record<Key, number> = {
  characters: 2,
  facts: 2,
  relationships: 2,
  openThreads: 2,
  timeline: 1,
};
export function applyMemoryDelta(
  previous: Continuity,
  summary: string,
  value: unknown,
): Continuity {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid continuity delta");
  const delta = value as Record<string, unknown>;
  if (Object.keys(delta).some((k) => k !== "add" && k !== "remove"))
    throw new Error("Invalid continuity delta key");
  const result: Continuity = { ...previous, summary };
  for (const group of ["add", "remove"] as const) {
    const changes = delta[group];
    if (changes === undefined) continue;
    if (!changes || typeof changes !== "object" || Array.isArray(changes))
      throw new Error("Invalid continuity changes");
    if (Object.keys(changes).some((k) => !keys.includes(k as Key)))
      throw new Error("Invalid continuity list name");
  }
  for (const key of keys) {
    const remove =
      (delta.remove as Partial<Record<Key, unknown>> | undefined)?.[key] || [];
    const add =
      (delta.add as Partial<Record<Key, unknown>> | undefined)?.[key] || [];
    if (
      !Array.isArray(remove) ||
      remove.length > (key === "openThreads" ? 15 : 12) ||
      new Set(remove).size !== remove.length ||
      remove.some(
        (i) => !Number.isInteger(i) || i < 0 || i >= previous[key].length,
      )
    )
      throw new Error("Invalid continuity removal");
    if (remove.length && key !== "relationships" && key !== "openThreads")
      throw new Error("Stable facts cannot be removed");
    if (
      !Array.isArray(add) ||
      add.length > limits[key] ||
      add.some((x) => typeof x !== "string" || !x.trim() || x.length > 250)
    )
      throw new Error("Invalid continuity addition");
    result[key] = [
      ...new Set([
        ...previous[key].filter((_, i) => !remove.includes(i)),
        ...add.map((x) => String(x).trim()),
      ]),
    ];
  }
  return parseMemory(result);
}
