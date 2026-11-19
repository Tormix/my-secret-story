export type Lang = "es" | "en";
export type Localized = { es: string; en: string };
export type Universe =
  | "detective"
  | "firefighter"
  | "lawyer"
  | "crossfit"
  | "chef"
  | "nile"
  | "highlands"
  | "neighbor"
  | "vineyard"
  | "train"
  | "actor"
  | "business"
  | "reunion";
export type Intensity = "romantic" | "sensual" | "intense";
export type Pronouns = "she" | "he" | "they";
export interface Profile {
  name: string;
  gender: "woman" | "man" | "nonbinary";
  pronouns: Pronouns;
  age?: number;
  occupation?: string;
  city?: string;
  wishes?: string;
  boundaries?: string;
  traits: string;
  lifeDetails?: string;
  tone?: "funny" | "tender" | "mysterious" | "dramatic";
  protagonistMode?: "self" | "fictional";
  photo?: string;
}
export interface Choice {
  id: string;
  label: Localized;
  route?: "together" | "solo";
  trust: number;
  courage: number;
}
export interface Decision {
  chapter: number;
  choiceId: string;
  label?: string;
  at: string;
}
export interface Novel {
  source?: "offline" | "chatgpt" | "api";
  generationId?: string;
  adventure?: import("./adventure").AdventureConfig;
  blueprint?: import("./adventure").Blueprint;
  memory?: import("./adventure").Continuity;
  generated?: Record<
    string,
    import("../services/chatgpt/protocol").GeneratedChapter
  >;
  id: string;
  universe: Universe;
  profile: Profile;
  intensity: Intensity;
  cover?: string;
  /** Photo use explicitly authorized for this novel cover. */
  coverRequested?: boolean;
  coverStyle: number;
  chapter: number;
  readingChapter?: number;
  route: "together" | "solo" | null;
  trust: number;
  courage: number;
  decisions: Decision[];
  unlocked: number[];
  endings: string[];
  completed: boolean;
  illustrations: Record<string, string>;
  scroll: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}
export interface AppState {
  version: 1;
  profile: Profile;
  novels: Novel[];
  settings: {
    lang: Lang;
    darkReader: boolean;
    fontSize: number;
    adultConfirmed: boolean;
    model?: string;
    catalogCovers?: Record<string, string>;
    generationConsent?: boolean;
  };
  wallet: { credits: number; premium: boolean };
}
export interface Story {
  id: Universe;
  title: Localized;
  role: Localized;
  tagline: Localized;
  synopsis: Localized;
  setting: Localized;
  person: string;
  color: string;
  chapterTitles: Localized[];
  chapters: {
    opening: Localized;
    together: Localized;
    solo: Localized;
    endingTogether: Localized;
    endingApart: Localized;
  };
  choices: [Choice[], Choice[]];
}
export interface Chapter {
  number: number;
  title: string;
  paragraphs: string[];
  choices: Choice[];
  ending?: string;
  illustration: "scene1" | "scene2";
}
export interface NarrativeProvider {
  catalog(): Story[];
  chapter(novel: Novel, lang: Lang): Chapter;
  prompt(novel: Novel, lang: Lang): string;
}
