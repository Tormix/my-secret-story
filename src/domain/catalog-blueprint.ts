import type { Novel, Lang } from "./types";
import type { Blueprint } from "./adventure";
import { chapterCount } from "./adventure";
import { getTemplate } from "../data/templates";
const bridges: Record<number, string> = {
  2: "Dar consecuencias al encuentro inicial y plantear un objetivo compartido sin imponer una decisión.",
  4: "La colaboración revela una diferencia concreta de valores y una primera afinidad.",
  5: "Un contratiempo obliga a negociar límites y muestra una faceta inesperada del interés romántico.",
  7: "La cercanía tiene un coste práctico; respetar las responsabilidades y elecciones de la protagonista.",
  8: "Una oportunidad de intimidad o independencia cambia la confianza según las decisiones previas.",
  10: "Las consecuencias del giro anterior exigen una acción concreta y abren alternativas reales.",
  11: "Contrastar la información recibida y preparar la crisis sin forzar una ruptura o reconciliación.",
  13: "La protagonista toma la iniciativa para afrontar el conflicto respetando los vínculos y hechos establecidos.",
  14: "Concretar las consecuencias de sus decisiones y preparar una resolución ganada, todavía abierta.",
};
export function catalogBlueprint(novel: Novel, lang: Lang): Blueprint {
  const template = getTemplate(novel.universe),
    config = novel.adventure;
  if (!config) throw new Error("Falta la ficha de aventura.");
  const count = chapterCount(novel),
    anchors = (config.milestones || template.milestones).map((b, i) => ({
      ...b,
      chapter:
        count === 12
          ? (config.milestones || template.milestones).length === 6
            ? [1, 3, 5, 7, 9, 12][i] || b.chapter
            : Math.max(1, Math.round(((b.chapter - 1) * 11) / 14) + 1)
          : b.chapter,
    }));
  const beats = Array.from({ length: count }, (_, i) => ({
    chapter: i + 1,
    aim:
      anchors.find((b) => b.chapter === i + 1)?.aim ||
      bridges[i + 1] ||
      "Resolver las consecuencias de las decisiones y cerrar los conflictos principales de forma coherente.",
  }));
  return {
    title: config.goal || template.title,
    synopsis: config.plot || template.hook,
    beats,
    memory: {
      summary:
        "La aventura aún no ha comenzado. Adaptar los objetivos del catálogo a la ficha y las decisiones de la protagonista.",
      characters: [
        `${novel.profile.name}, persona adulta${novel.profile.age ? ` de ${novel.profile.age} años` : ""}; profesión: ${novel.profile.occupation || "no declarada"}.`,
        `${config.loveInterestName}, persona adulta; ${config.loveInterestRole}.`,
      ],
      facts: [`Lugar inicial: ${config.setting}.`],
      relationships: [],
      openThreads: [],
      timeline: [],
    },
    timing: {
      startedAt: new Date().toISOString(),
      totalMs: 0,
      characters: 0,
      model: "catalog-local",
      inputTokens: 0,
      outputTokens: 0,
    },
    lang,
  };
}
