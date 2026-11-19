import { Directory, File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { captureProfilePhoto } from "./photo-flow";
import type { AppState } from "../domain/types";
const root = () => {
  const dir = new Directory(Paths.document, "storymuse");
  dir.create({ idempotent: true, intermediates: true });
  return dir;
};
export async function pickLocalImage(
  crop = false,
): Promise<string | undefined> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: crop,
    aspect: [1, 1],
    quality: 0.9,
  });
  if (result.canceled) return undefined;
  const asset = result.assets[0];
  return keepSelectedPhoto(asset);
}
function keepSelectedPhoto(asset: { uri: string; mimeType?: string | null }) {
  const extension =
    asset.mimeType === "image/png"
      ? "png"
      : asset.mimeType === "image/webp"
        ? "webp"
        : "jpg";
  const target = new File(
    root(),
    `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`,
  );
  new File(asset.uri).copy(target);
  return target.uri;
}

export async function takeLocalPhoto(): Promise<string | undefined> {
  return captureProfilePhoto({
    permission: ImagePicker.requestCameraPermissionsAsync,
    launch: () =>
      ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: false,
        quality: 0.9,
      }),
    keep: keepSelectedPhoto,
  });
}

export async function keepPng(uri: string) {
  const target = new File(
    root(),
    `cover-${Date.now()}-${Math.random().toString(36).slice(2)}.png`,
  );
  new File(uri).copy(target);
  return target.uri;
}
export async function shareFile(uri: string, mimeType = "image/png") {
  if (!(await Sharing.isAvailableAsync()))
    throw new Error("Sharing unavailable");
  await Sharing.shareAsync(uri, { mimeType, dialogTitle: "My Secret Story" });
}
export async function sharePhoto(uri: string) {
  const type = uri.toLowerCase().endsWith(".png")
    ? "image/png"
    : uri.toLowerCase().endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";
  await shareFile(uri, type);
}
export async function exportPersonalData(state: AppState) {
  const file = new File(Paths.cache, "My Secret Story-datos.json");
  file.write(
    JSON.stringify(
      {
        ...state,
        exportedAt: new Date().toISOString(),
        notice:
          "Local metadata export. Referenced images are private app files; export those individually before uninstalling.",
      },
      null,
      2,
    ),
  );
  await shareFile(file.uri, "application/json");
}
export async function purgeMedia() {
  const dir = root();
  if (dir.exists) dir.delete();
}
export async function pruneMedia(state: AppState) {
  const refs = new Set(
    [
      state.profile.photo,
      ...Object.values(state.settings.catalogCovers || {}),
      ...state.novels.flatMap((n) => [
        n.profile.photo,
        n.cover,
        ...Object.values(n.illustrations),
      ]),
    ].filter(Boolean),
  );
  for (const file of root().list())
    if (file instanceof File && !refs.has(file.uri)) file.delete();
}

export async function saveGeneratedImage(base64: string): Promise<string> {
  const { Base64 } = await import("js-base64");
  const target = new File(
    root(),
    `api-cover-${Date.now()}-${Math.random().toString(36).slice(2)}.png`,
  );
  target.write(Base64.toUint8Array(base64));
  return target.uri;
}

export async function photoDataUrl(uri: string): Promise<string> {
  const file = new File(uri);
  if (!file.exists || !file.size || file.size > 10 * 1024 * 1024)
    throw new Error(
      "Selecciona una imagen JPEG, PNG o WebP de menos de 10 MB.",
    );
  const mime = uri.endsWith(".png")
    ? "image/png"
    : uri.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";
  return `data:${mime};base64,${await file.base64()}`;
}
