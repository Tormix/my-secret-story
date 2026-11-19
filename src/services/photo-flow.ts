export interface PhotoFlow {
  permission: () => Promise<{ granted: boolean; canAskAgain: boolean }>;
  launch: () => Promise<{
    canceled: boolean;
    assets: { uri: string; mimeType?: string | null }[] | null;
  }>;
  keep: (asset: { uri: string; mimeType?: string | null }) => string;
}
export async function captureProfilePhoto(
  flow: PhotoFlow,
): Promise<string | undefined> {
  const permission = await flow.permission();
  if (!permission.granted)
    throw new Error(
      permission.canAskAgain
        ? "No has permitido usar la cámara. Puedes volver a intentarlo, elegir una foto de la galería o seguir sin foto."
        : "La cámara está desactivada para esta app. Puedes activarla en los ajustes de Android, elegir la galería o seguir sin foto.",
    );
  const result = await flow.launch();
  if (result.canceled || !result.assets?.[0]) return undefined;
  return flow.keep(result.assets[0]);
}
