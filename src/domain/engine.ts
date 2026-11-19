import { chapterCount } from "./adventure";
import type { AppState, Novel, Profile, Universe, Intensity } from "./types";
export const defaultProfile: Profile = {
  name: "",
  gender: "woman",
  pronouns: "she",
  traits: "",
};
export const initialState = (): AppState => ({
  version: 1,
  profile: { ...defaultProfile },
  novels: [],
  settings: {
    lang: "es",
    model: "gpt-6.1-sol",
    darkReader: true,
    fontSize: 19,
    adultConfirmed: false,
  },
  wallet: { credits: 12, premium: false },
});
export function createNovel(
  universe: Universe,
  profile: Profile,
  intensity: Intensity,
  id: string,
): Novel {
  if (!profile.name.trim() || profile.name.trim().length > 40)
    throw new Error("NAME");
  if (
    profile.age !== undefined &&
    (!Number.isInteger(profile.age) || profile.age < 18 || profile.age > 120)
  )
    throw new Error("AGE");
  const now = new Date().toISOString();
  return {
    id,
    generationId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    universe,
    profile: { ...profile, name: profile.name.trim() },
    intensity,
    coverStyle: 0,
    chapter: 0,
    readingChapter: 0,
    route: null,
    trust: 0,
    courage: 0,
    decisions: [],
    unlocked: [0],
    endings: [],
    completed: false,
    illustrations: {},
    scroll: {},
    createdAt: now,
    updatedAt: now,
  };
}
export function selectChoice(
  novel: Novel,
  choice: {
    id: string;
    trust: number;
    courage: number;
    route?: "together" | "solo";
    label?: import("./types").Localized;
  },
): Novel {
  if (
    novel.completed ||
    novel.chapter >= chapterCount(novel) - 1 ||
    novel.decisions.some((d) => d.chapter === novel.chapter)
  )
    throw new Error("DECISION");
  if (
    novel.adventure &&
    !novel.generated?.[String(novel.chapter)]?.choices.some(
      (c) => c.id === choice.id,
    )
  )
    throw new Error("DECISION");
  if (!novel.unlocked.includes(novel.chapter + 1)) throw new Error("LOCKED");
  return {
    ...novel,
    route: choice.route ?? novel.route,
    trust: novel.trust + choice.trust,
    courage: novel.courage + choice.courage,
    decisions: [
      ...novel.decisions,
      {
        chapter: novel.chapter,
        choiceId: choice.id,
        label:
          choice.label?.[
            novel.generated?.[String(novel.chapter)]?.lang || "es"
          ],
        at: new Date().toISOString(),
      },
    ],
    chapter: novel.chapter + 1,
    updatedAt: new Date().toISOString(),
  };
}
export function unlock(state: AppState, id: string): AppState {
  const novel = state.novels.find((n) => n.id === id);
  if (!novel) throw new Error("MISSING");
  const next = novel.chapter + 1;
  if (next >= chapterCount(novel) || novel.unlocked.includes(next))
    return state;
  if (novel.adventure) {
    if (next >= 3 && !state.wallet.premium) throw new Error("PREMIUM");
    return {
      ...state,
      novels: state.novels.map((n) =>
        n.id === id ? { ...n, unlocked: [...n.unlocked, next] } : n,
      ),
    };
  }
  if (!state.wallet.premium && state.wallet.credits < 3)
    throw new Error("CREDITS");
  return {
    ...state,
    wallet: {
      ...state.wallet,
      credits: state.wallet.credits - (state.wallet.premium ? 0 : 3),
    },
    novels: state.novels.map((n) =>
      n.id === id ? { ...n, unlocked: [...n.unlocked, next] } : n,
    ),
  };
}
export function endingId(novel: Novel): "together" | "apart" {
  return novel.trust >= 2 ? "together" : "apart";
}
export function finish(novel: Novel): Novel {
  if (
    novel.chapter !== chapterCount(novel) - 1 ||
    (novel.adventure && !novel.generated?.[String(novel.chapter)])
  )
    throw new Error("CHAPTER");
  return {
    ...novel,
    completed: true,
    endings: [
      ...new Set([
        ...novel.endings,
        novel.adventure
          ? `adventure-${novel.decisions.map((d) => d.choiceId).join("_")}`
          : endingId(novel),
      ]),
    ],
    updatedAt: new Date().toISOString(),
  };
}
export function restart(novel: Novel): Novel {
  return {
    ...novel,
    generationId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    blueprint: undefined,
    memory: undefined,
    generated: {},
    unlocked: novel.adventure ? [0] : novel.unlocked,
    chapter: 0,
    readingChapter: 0,
    route: null,
    trust: 0,
    courage: 0,
    decisions: [],
    scroll: {},
    completed: false,
    updatedAt: new Date().toISOString(),
  };
}

export const novelId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
