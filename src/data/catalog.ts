import type { Story, Universe } from "../domain/types";
import { templates } from "./templates";
import { legacyTemplates } from "./legacy-templates";
import { prose } from "./prose";
const legacy: Record<Universe, keyof typeof prose> = {
  detective: "detective",
  firefighter: "firefighter",
  lawyer: "lawyer",
  crossfit: "crossfit",
  chef: "chef",
  nile: "detective",
  highlands: "firefighter",
  neighbor: "chef",
  vineyard: "chef",
  train: "detective",
  actor: "detective",
  business: "lawyer",
  reunion: "lawyer",
};
const l = (es: string) => ({ es, en: es });
export const stories: Story[] = [
  ...templates,
  ...legacyTemplates.filter((t) => !templates.some((n) => n.id === t.id)),
].map((t) => ({
  id: t.id,
  title: l(t.title),
  role: l(t.role),
  tagline: l(t.category),
  synopsis: l(t.hook),
  setting: l(t.setting),
  person: t.person,
  color: "#c49872",
  chapterTitles: [
    l("El primer encuentro"),
    l("Lo que cambia entre nosotros"),
    l("Elegir el siguiente paso"),
  ],
  chapters: prose[legacy[t.id]],
  choices: [
    [
      {
        id: "together",
        label: l("Hablar con sinceridad y conocerle mejor"),
        route: "together",
        trust: 2,
        courage: 0,
      },
      {
        id: "solo",
        label: l("Tomarme mi tiempo antes de confiar"),
        route: "solo",
        trust: 0,
        courage: 2,
      },
    ],
    [
      {
        id: "open",
        label: l("Proponer un acuerdo honesto"),
        trust: 2,
        courage: 1,
      },
      { id: "boundary", label: l("Mantener mi límite"), trust: -2, courage: 2 },
    ],
  ],
}));
export function getStory(id: Universe) {
  const s = stories.find((s) => s.id === id);
  if (!s) throw new Error("STORY");
  return s;
}
