// Local browser QA adapter. Production Android uses private expo-file-system paths.
import type { AppState } from "../domain/types";
function selectPhoto(camera = false): Promise<string | undefined> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    if (camera) input.capture = "user";
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) {
        resolve(undefined);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(f);
    };
    input.oncancel = () => resolve(undefined);
    input.click();
  });
}
export async function keepPng(uri: string) {
  return uri;
}
export async function shareFile(uri: string) {
  const a = document.createElement("a");
  a.href = uri;
  a.download = "My Secret Story-portada.png";
  a.click();
}
export const sharePhoto = shareFile;
export async function exportPersonalData(state: AppState) {
  const uri = URL.createObjectURL(
    new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = uri;
  a.download = "My Secret Story-datos.json";
  a.click();
  URL.revokeObjectURL(uri);
}
export async function purgeMedia() {}
export async function pruneMedia(_state: AppState) {}

export async function saveGeneratedImage(base64: string): Promise<string> {
  return `data:image/png;base64,${base64}`;
}

export async function photoDataUrl(uri: string): Promise<string> {
  if (
    !/^data:image\/(png|jpeg|webp);base64,/.test(uri) ||
    uri.length > 14_000_000
  )
    throw new Error(
      "Selecciona una imagen JPEG, PNG o WebP de menos de 10 MB.",
    );
  return uri;
}

export function pickLocalImage(_crop = false) {
  return selectPhoto();
}
export function takeLocalPhoto() {
  return selectPhoto(true);
}
