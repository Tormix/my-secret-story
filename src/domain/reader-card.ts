import type { Profile } from "./types";
export function readReaderCard(raw: string, previous: Profile): Profile {
  const text = raw.trim();
  if (!text) throw new Error("Pega una ficha primero.");
  if (text.length > 6000)
    throw new Error("La ficha es demasiado larga (máximo 6.000 caracteres).");
  if (!text.startsWith("{"))
    return { ...previous, lifeDetails: text.slice(0, 2000) };
  const data = JSON.parse(text);
  if (!data || Array.isArray(data) || typeof data !== "object")
    throw new Error("La ficha JSON debe ser un objeto.");
  const pick = (
    keys: string[],
    max: number,
    defaultValue: string | undefined,
  ) => {
    for (const key of keys) {
      if (data[key] !== undefined) {
        if (typeof data[key] !== "string")
          throw new Error(`El campo ${key} debe ser texto.`);
        return data[key].trim().slice(0, max);
      }
    }
    return defaultValue;
  };
  const age = data.age ?? data.edad ?? previous.age;
  if (
    age !== undefined &&
    (!Number.isInteger(Number(age)) || Number(age) < 18 || Number(age) > 120)
  )
    throw new Error(
      "La edad debe ser de una persona adulta, entre 18 y 120 años.",
    );
  const detail =
    pick(
      ["lifeDetails", "detalles", "situacion", "situación"],
      2000,
      previous.lifeDetails,
    ) || "";
  const extras = [
    "hijos",
    "children",
    "situacion_sentimental",
    "situación_sentimental",
    "relationship",
    "aficiones",
    "aspecto",
    "descripcion",
    "description",
  ]
    .filter((k) => data[k] !== undefined)
    .map(
      (k) =>
        `${k}: ${typeof data[k] === "string" ? data[k] : JSON.stringify(data[k])}`,
    )
    .join("; ");
  return {
    ...previous,
    name: pick(["name", "nombre"], 40, previous.name) || "",
    age: age === undefined ? undefined : Number(age),
    traits:
      pick(["traits", "personalidad", "rasgos"], 1000, previous.traits) || "",
    occupation: pick(
      ["occupation", "profesion", "profesión", "trabajo"],
      140,
      previous.occupation,
    ),
    city: pick(["city", "ciudad"], 100, previous.city),
    lifeDetails: [detail, extras].filter(Boolean).join("\n").slice(0, 2000),
    wishes: pick(["wishes", "deseos"], 800, previous.wishes),
    boundaries: pick(
      ["boundaries", "limites", "límites"],
      800,
      previous.boundaries,
    ),
  };
}
