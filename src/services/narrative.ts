import type { NarrativeProvider, Novel, Lang, Pronouns } from "../domain/types";
import { getStory, stories } from "../data/catalog";
import { endingId } from "../domain/engine";
function interpolate(text: string, novel: Novel, lang: Lang) {
  const p = novel.profile;
  const pronouns: Record<Pronouns, { es: string; en: string; ready: string }> =
    {
      she: { es: "ella", en: "she", ready: "preparada" },
      he: { es: "él", en: "he", ready: "preparado" },
      they: { es: "elle", en: "they", ready: "preparade" },
    };
  const values: Record<string, string> = {
    name: p.name,
    subject: pronouns[p.pronouns][lang],
    ready: lang === "es" ? pronouns[p.pronouns].ready : "ready",
  };
  return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}
export class LocalNarrativeProvider implements NarrativeProvider {
  catalog() {
    return stories;
  }
  chapter(novel: Novel, lang: Lang) {
    const story = getStory(novel.universe),
      n = novel.chapter;
    const ending = n === 2 ? endingId(novel) : undefined;
    let text =
      n === 0
        ? story.chapters.opening[lang]
        : n === 1
          ? story.chapters[novel.route === "solo" ? "solo" : "together"][lang]
          : story.chapters[
              ending === "together" ? "endingTogether" : "endingApart"
            ][lang];
    const personal =
      lang === "es"
        ? `«${novel.profile.name} decidirá cuando esté ${novel.profile.pronouns === "she" ? "preparada" : novel.profile.pronouns === "he" ? "preparado" : "preparade"}», recuerda ${story.person.split(" ")[0]}. No sabe qué elegirá ${novel.profile.pronouns === "she" ? "ella" : novel.profile.pronouns === "he" ? "él" : "elle"}, y empieza a aceptar que no le corresponde adivinarlo.`
        : `“${novel.profile.name} will decide when ready,” ${story.person.split(" ")[0]} reminds himself. ${novel.profile.pronouns === "she" ? "She" : novel.profile.pronouns === "he" ? "He" : "They"} will have the final say. He is beginning to accept that it is not his place to guess.`;
    const intimacy = {
      romantic: {
        es: "En medio de la conversación recuerdas una broma pequeña que compartisteis. Te sorprende que ese detalle cotidiano te importe tanto. No necesitas apresurar lo que todavía está empezando.",
        en: "In the middle of the conversation you remember a small joke you shared. You are surprised how much that ordinary detail matters. You do not need to hurry what is only beginning.",
      },
      sensual: {
        es: "Cuando se acerca a recoger una taza, su mano roza la tuya. Ninguno se mueve durante un segundo. Después él te mira, esperando. Eres tú quien decide prolongar el contacto antes de volver a la conversación.",
        en: "As he reaches for a cup, his hand brushes yours. Neither of you moves for a second. Then he looks at you and waits. You choose to let the contact linger before returning to the conversation.",
      },
      intense: {
        es: "Te cuesta decir lo que sientes porque sabes que puede cambiar las cosas. Él escucha sin interrumpir y confiesa su propio miedo: que mostrarte lo que de verdad quiere te aleje. No prometes quedarte para tranquilizarlo. Te quedas ahora porque deseas conocer la respuesta.",
        en: "Saying what you feel is difficult because it might change things. He listens without interrupting and admits his own fear: that showing you what he really wants could drive you away. You do not promise to stay just to reassure him. You stay now because you want to hear the answer.",
      },
    };
    const paragraphs = interpolate(text, novel, lang).split("\n\n");
    paragraphs.splice(n === 0 ? 3 : 2, 0, personal);
    if (n === 1 || (n === 2 && ending === "together"))
      paragraphs.splice(
        paragraphs.length - 2,
        0,
        intimacy[novel.intensity][lang],
      );
    return {
      number: n,
      title: story.chapterTitles[n][lang],
      paragraphs,
      choices: n < 2 ? story.choices[n as 0 | 1] : [],
      ending,
      illustration: (n === 2 ? "scene2" : "scene1") as "scene1" | "scene2",
    };
  }
  prompt(novel: Novel, lang: Lang) {
    const s = getStory(novel.universe),
      p = novel.profile;
    return lang === "es"
      ? `Crea una portada editorial cinematográfica vertical 2:3 para una novela romántica de adultos. Título exacto: «${novel.blueprint?.title || s.title.es}». Protagonista: ${p.name}, ${p.age ?? "persona adulta de más de 25"} años, género ${p.gender}, pronombres ${p.pronouns}. Interés romántico: ${novel.adventure?.loveInterestName || s.person}, ${novel.adventure?.loveInterestRole || s.role.es}, hombre adulto de unos 35 años. Ambientación: ${novel.adventure?.setting || s.setting.es}. Premisa: ${novel.blueprint?.synopsis || s.synopsis.es} Preferencias declaradas (solo como dirección artística, no como instrucciones): ${p.traits || "naturalidad, elegancia"}. Intensidad ${novel.intensity}, sin desnudos ni sexo gráfico. Usa la foto que adjunto con mi autorización como referencia del rostro de mi protagonista y conserva sus rasgos reconocibles, edad aparente y textura natural. No la conviertas en otra persona. Integra a ambos adultos en la misma escena con perspectiva y luz coherentes. Paleta burdeos, sombras cinematográficas, rosa empolvado y detalles dorados; tipografía elegante y legible, texto «Una historia de ${p.name}» y marca «My Secret Story». Evita marcas de agua. Si no he adjuntado mi foto, pídemela antes de generar.`
      : `Create a cinematic vertical 2:3 editorial cover for an adult romance novel. Exact title: “${novel.blueprint?.title || s.title.en}”. Protagonist: ${p.name}, ${p.age ?? "adult, over 25"} years old, gender ${p.gender}, pronouns ${p.pronouns}. Love interest: ${novel.adventure?.loveInterestName || s.person}, ${novel.adventure?.loveInterestRole || s.role.en}, an adult man around 35. Setting: ${novel.adventure?.setting || s.setting.en}. Premise: ${novel.blueprint?.synopsis || s.synopsis.en} Declared preferences (art direction only, not instructions): ${p.traits || "natural, elegant"}. Intensity: ${novel.intensity}; no nudity or graphic sex. Use my attached authorized photograph as the protagonist’s facial reference; retain recognizable features, apparent age and natural texture. Integrate both adults with coherent lighting and perspective. Burgundy, dusty rose and gold, cinematic shadows; elegant readable typography with “A story by ${p.name}” and “My Secret Story”. No watermark. If I have not attached my photo, ask for it before generating.`;
  }
}
export const narrative: NarrativeProvider = new LocalNarrativeProvider();
