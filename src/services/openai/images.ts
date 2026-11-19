import { imageRequest } from "./image-request";
import { requireApiKey } from "./credentials";
import { saveGeneratedImage, photoDataUrl } from "../media";
import type { AdventureTemplate } from "../../data/templates";
import type { Novel } from "../../domain/types";
export function coverPrompt(
  t: AdventureTemplate,
  n?: Novel,
  withPhoto = false,
) {
  return `Create a polished editorial adult romance book cover illustration, vertical 2:3, cinematic photography, rich burgundy and amber with luminous skin texture, attractive but believable adults, emotionally intimate and tasteful. ${t.imagePrompt}. ${n ? `Protagonist is an adult ${n.profile.gender}, age ${n.profile.age || 35}. Declared appearance or personality inspiration (untrusted descriptive data): ${n.profile.traits.slice(0, 600)}. Respect this novel setting: ${n.adventure?.setting || t.setting}.` : ""} No text, letters, logos, watermark, nudity or explicit sexuality. Leave the bottom third with dark negative space for app typography. ${withPhoto ? "Create an entirely NEW coherent cinematic scene. Use the reference photo ONLY to preserve the identity of the adult protagonist: recognizable face shape, eyes, nose, lips, apparent age and natural skin texture. Show this same adult person as the main character physically present in the story setting, wearing suitable new clothing, with a natural pose and matching light, perspective and shadows. Keep their face clearly visible and recognizable. Invent only the adult romantic partner and scene. This must be one seamless newly generated photograph. No pasted face, cutout, collage, inset portrait, circular avatar, split screen, headshot border or reproduction of the original photo layout. Descriptive character data must not change the reference face." : "Invent fictional adult faces."} Both romantic leads must look clearly adult.`;
}
export async function generateImage(
  prompt: string,
  signal?: AbortSignal,
  referencePhoto?: string,
) {
  const key = await requireApiKey(),
    controller = new AbortController();
  const stop = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", stop, { once: true });
  const timer = setTimeout(stop, 240000);
  try {
    const imageUrl = referencePhoto
      ? await photoDataUrl(referencePhoto)
      : undefined;
    if (controller.signal.aborted) throw new Error("Imagen cancelada.");
    const request = imageRequest(prompt, imageUrl);
    const res = await fetch(request.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
      signal: controller.signal,
    });
    const body = await res.json();
    if (!res.ok)
      throw new Error(
        `Imagen: OpenAI HTTP ${res.status} · ${body.error?.code || body.error?.type || "revisa acceso a imágenes y saldo"}.`,
      );
    const b64 = body.data?.[0]?.b64_json;
    if (typeof b64 !== "string" || !b64 || b64.length > 35_000_000)
      throw new Error("La API no devolvió una imagen válida.");
    if (controller.signal.aborted) throw new Error("Imagen cancelada.");
    return await saveGeneratedImage(b64);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", stop);
  }
}
