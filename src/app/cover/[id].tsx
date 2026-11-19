import React, { useEffect, useRef, useState } from "react";
import { Image, Switch } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useStore } from "../../state/Store";
import {
  Button,
  colors,
  ErrorNotice,
  Eyebrow,
  Page,
  Panel,
  Title,
  Txt,
} from "../../components/ui";
import { CoverViewer } from "../../components/CoverViewer";
import { StoryWaiting } from "../../components/StoryWaiting";
import { generateImage, coverPrompt } from "../../services/openai/images";
import { getTemplate } from "../../data/templates";
import { pickLocalImage } from "../../services/media";
export default function Cover() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    { state, change } = useStore(),
    novel = state.novels.find((n) => n.id === id),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [consent, setConsent] = useState(false),
    abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  if (!novel)
    return (
      <Page back>
        <ErrorNotice message="Historia no encontrada." />
      </Page>
    );
  const n = novel;
  async function generate(withPhoto = false) {
    if (withPhoto && (!consent || !n.profile.photo)) return;
    if (abort.current) return;
    setBusy(true);
    setError("");
    abort.current = new AbortController();
    try {
      const uri = await generateImage(
        coverPrompt(getTemplate(n.universe), n, withPhoto),
        abort.current.signal,
        withPhoto ? n.profile.photo : undefined,
      );
      if (abort.current.signal.aborted) return;
      await change((s) => ({
        ...s,
        novels: s.novels.map((x) =>
          x.id === n.id && x.generationId === n.generationId
            ? { ...x, cover: uri }
            : x,
        ),
      }));
    } catch (e) {
      setError(
        abort.current?.signal.aborted
          ? "Generación cancelada. Conservamos tu portada anterior."
          : e instanceof Error
            ? e.message
            : String(e),
      );
    } finally {
      abort.current = null;
      setBusy(false);
    }
  }
  return (
    <Page back title="Tu edición personal">
      <Eyebrow>PROTAGONIZADA POR {n.profile.name.toUpperCase()}</Eyebrow>
      <Title>Tu historia tiene portada.</Title>
      <CoverViewer novel={n} />
      <Txt style={{ fontSize: 11, color: colors.muted }}>
        {n.cover
          ? "Imagen guardada en tu móvil."
          : "Portada del catálogo. Puedes crear una versión contigo como protagonista."}
      </Txt>
      <Panel>
        <Txt style={{ color: colors.muted }}>
          Elige una foto para protagonizar la portada de esta aventura. Solo la
          enviamos a OpenAI cuando pulsas «Crear portada con mi foto». El
          parecido puede variar. El título y tu nombre se añaden en la app.
        </Txt>
        {busy ? (
          <>
            <StoryWaiting phase="Creando una escena para tu novela…" />
            <Button
              secondary
              label="Cancelar imagen"
              onPress={() => abort.current?.abort()}
            />
          </>
        ) : (
          <Button
            label={n.cover ? "Otra portada sin foto" : "Crear portada sin foto"}
            onPress={() => void generate()}
          />
        )}
        <Button
          secondary
          disabled={busy}
          label={
            n.profile.photo
              ? "Cambiar mi foto de referencia"
              : "Subir mi foto de referencia"
          }
          onPress={() => {
            void (async () => {
              try {
                const uri = await pickLocalImage();
                if (uri) {
                  setConsent(false);
                  await change((s) => ({
                    ...s,
                    novels: s.novels.map((x) =>
                      x.id === n.id
                        ? { ...x, profile: { ...x.profile, photo: uri } }
                        : x,
                    ),
                  }));
                }
              } catch (e) {
                setError(String(e));
              }
            })();
          }}
        />
        {n.profile.photo ? (
          <>
            <Image
              source={{ uri: n.profile.photo }}
              accessibilityLabel="Tu foto de referencia"
              style={{
                width: 100,
                height: 100,
                borderRadius: 20,
                alignSelf: "center",
              }}
            />
            <Txt style={{ fontSize: 12, color: colors.muted }}>
              La foto es mía o tengo permiso, corresponde a una persona adulta y
              autorizo enviarla a OpenAI para esta portada.
            </Txt>
            <Switch
              accessibilityLabel="Autorizar envío de mi foto para la portada"
              value={consent}
              onValueChange={setConsent}
              disabled={busy}
              trackColor={{ true: colors.rose }}
            />
            <Button
              label="Crear portada con mi foto"
              disabled={busy || !consent}
              onPress={() => void generate(true)}
            />
          </>
        ) : null}
      </Panel>
      {error ? <ErrorNotice message={error} /> : null}
    </Page>
  );
}
