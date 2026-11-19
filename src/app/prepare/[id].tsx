import { getApiKey } from "../../services/openai/credentials";
import { canShowOpening } from "../../domain/novel-layout";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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
import { ChapterDraft } from "../../components/ChapterDraft";
import { ParagraphStream } from "../../services/chatgpt/paragraph-stream";
import { StoryWaiting } from "../../components/StoryWaiting";
import { commitBlueprint, commitChapter } from "../../domain/adventure";
import { getTemplate } from "../../data/templates";
import { generateImage, coverPrompt } from "../../services/openai/images";
import {
  generateBlueprint,
  generateAdventureChapter,
} from "../../services/chatgpt/client";
import { prepareAdventure } from "../../services/preparation";
function message(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}
export default function Prepare() {
  const { id, auto } = useLocalSearchParams<{ id: string; auto?: string }>();
  const { state, change } = useStore();
  const { width } = useWindowDimensions();
  const coverWidth = Math.min(Math.max(width - 48, 200), 440);
  const novel = state.novels.find((n) => n.id === id);
  const current = useRef(novel);
  useEffect(() => {
    current.current = novel;
  }, [novel]);
  const running = useRef({ cover: false, text: false });
  const controller = useRef<AbortController | null>(null);
  const [coverBusy, setCoverBusy] = useState(false),
    [textBusy, setTextBusy] = useState(false);
  const [coverError, setCoverError] = useState(""),
    [textError, setTextError] = useState("");
  const [needsKey, setNeedsKey] = useState(auto === "0");
  const [draft, setDraft] = useState<string[]>([]);
  const [phase, setPhase] = useState("Preparando tu aventura…");
  const model = state.settings.model || "gpt-6.1-sol",
    lang = state.settings.lang;
  const consent = state.settings.generationConsent;
  const start = useCallback(
    async (which: "both" | "cover" | "text" = "both") => {
      const n = current.current;
      if (!n) return;
      if (!consent) {
        setTextError(
          "Autoriza el envío de tu ficha desde la creación de historia.",
        );
        return;
      }
      if (!controller.current || controller.current.signal.aborted)
        controller.current = new AbortController();
      const signal = controller.current.signal;
      const preview = new ParagraphStream();
      let shown = 0;
      const cover =
        which !== "text" &&
        n.coverRequested &&
        n.profile.photo &&
        !n.cover &&
        !running.current.cover;
      const text =
        which !== "cover" && !n.generated?.["0"] && !running.current.text;
      if (cover) {
        running.current.cover = true;
        setCoverBusy(true);
        setCoverError("");
      }
      if (text) {
        running.current.text = true;
        setTextBusy(true);
        setTextError("");
        setDraft([]);
      }
      try {
        if (!(await getApiKey())) {
          setNeedsKey(true);
          if (cover) {
            running.current.cover = false;
            setCoverBusy(false);
          }
          if (text) {
            running.current.text = false;
            setTextBusy(false);
          }
          return;
        }
        setNeedsKey(false);
      } catch (e) {
        setTextError(message(e));
        if (cover) {
          running.current.cover = false;
          setCoverBusy(false);
        }
        if (text) {
          running.current.text = false;
          setTextBusy(false);
        }
        return;
      }
      await prepareAdventure(
        n,
        {
          ...(cover
            ? {
                cover: {
                  generate: () =>
                    generateImage(
                      coverPrompt(getTemplate(n.universe), n, true),
                      signal,
                      n.profile.photo,
                    ),
                  save: async (uri: string) => {
                    await change((s) => ({
                      ...s,
                      novels: s.novels.map((x) =>
                        x.id === id && x.generationId === n.generationId
                          ? { ...x, cover: uri, coverRequested: false }
                          : x,
                      ),
                    }));
                  },
                  failed: (e: unknown) => setCoverError(message(e)),
                  settled: () => {
                    running.current.cover = false;
                    setCoverBusy(false);
                  },
                },
              }
            : {}),
          ...(text
            ? {
                text: {
                  blueprint: (working: typeof n) =>
                    generateBlueprint(working, lang, model, () => {}, signal),
                  saveBlueprint: async (
                    plan: Parameters<typeof commitBlueprint>[2],
                  ) => {
                    await change((s) => ({
                      ...s,
                      novels: s.novels.map((x) =>
                        x.id === id
                          ? commitBlueprint(x, n.generationId, plan)
                          : x,
                      ),
                    }));
                  },
                  chapter: (working: typeof n) =>
                    generateAdventureChapter(
                      working,
                      lang,
                      model,
                      (delta) => {
                        const paragraphs = preview.push(delta);
                        if (paragraphs.length > shown && !signal.aborted) {
                          shown = paragraphs.length;
                          setDraft([...paragraphs]);
                        }
                      },
                      signal,
                    ),
                  saveChapter: async (
                    result: Parameters<typeof commitChapter>[3],
                  ) => {
                    await change((s) => ({
                      ...s,
                      novels: s.novels.map((x) =>
                        x.id === id
                          ? commitChapter(x, n.generationId, 0, result)
                          : x,
                      ),
                    }));
                  },
                  phase: (value: "outline" | "chapter") =>
                    setPhase(
                      value === "outline"
                        ? "Preparando la escaleta de tu aventura…"
                        : "Escribiendo tu primer capítulo…",
                    ),
                  failed: (e: unknown) => setTextError(message(e)),
                  settled: () => {
                    running.current.text = false;
                    setTextBusy(false);
                  },
                },
              }
            : {}),
        },
        signal,
      );
    },
    [change, consent, id, lang, model],
  );
  useEffect(() => {
    const launch = setTimeout(() => {
      if (auto !== "0") void start();
    }, 0);
    return () => {
      clearTimeout(launch);
      controller.current?.abort();
    };
  }, [auto, start]);
  if (!novel)
    return (
      <Page back>
        <ErrorNotice message="Historia no encontrada." />
      </Page>
    );
  const ready = Boolean(novel.generated?.["0"]);
  const showOpening = canShowOpening(
    novel.coverRequested,
    novel.cover,
    coverError,
  );
  return (
    <Page back title="Tu novela está naciendo">
      <Eyebrow>PROTAGONIZADA POR {novel.profile.name.toUpperCase()}</Eyebrow>
      <Title>
        {novel.cover
          ? "Ya tienes tu portada."
          : "Tu próxima historia empieza contigo."}
      </Title>
      {coverBusy || textBusy ? (
        <StoryWaiting
          phase={[coverBusy ? "Creando tu portada" : "", textBusy ? phase : ""]
            .filter(Boolean)
            .join(" · ")}
        />
      ) : null}
      {needsKey && !ready ? (
        <Panel>
          <Txt>
            Tu ficha está guardada. Para escribir el capítulo, configura la
            conexión de esta demo en Ajustes y vuelve aquí.
          </Txt>
          <Button
            label="Abrir ajustes de conexión"
            onPress={() => router.push("/settings")}
          />
        </Panel>
      ) : null}
      {ready && showOpening ? (
        <Button
          label="Leer el primer capítulo"
          onPress={() =>
            router.push({
              pathname: "/read/[id]",
              params: { id: novel.id, auto: "0" },
            })
          }
        />
      ) : null}
      {novel.cover || !novel.coverRequested ? (
        <CoverViewer novel={novel} />
      ) : (
        <View
          style={{
            width: coverWidth,
            height: coverWidth * 1.5 + 28,
            alignSelf: "center",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: "center",
            padding: 28,
          }}
        >
          <Txt style={{ color: colors.muted, textAlign: "center" }}>
            Tu portada aparecerá aquí en cuanto esté lista.
          </Txt>
        </View>
      )}
      {novel.cover ? (
        <Txt style={{ color: colors.muted }}>
          {ready
            ? "Tu portada y el primer capítulo ya están guardados."
            : "Tu portada ya está guardada. Puedes verla mientras terminamos el primer capítulo."}
        </Txt>
      ) : null}
      {coverError ? (
        <>
          <ErrorNotice message={coverError} />
          <Button
            secondary
            label="Reintentar solo la portada"
            disabled={coverBusy}
            onPress={() => void start("cover")}
          />
        </>
      ) : null}
      {showOpening && !ready && draft.length > 0 ? (
        <ChapterDraft paragraphs={draft} />
      ) : null}
      {showOpening && !draft.length && !ready && !needsKey && !textError ? (
        <Panel>
          <Eyebrow>CAPÍTULO 1</Eyebrow>
          <Txt>
            El comienzo de tu novela aparecerá aquí en cuanto llegue el primer
            párrafo.
          </Txt>
        </Panel>
      ) : null}
      {textError ? (
        <>
          <ErrorNotice message={textError} />
          <Button
            label="Reintentar solo el capítulo"
            disabled={textBusy}
            onPress={() => void start("text")}
          />
        </>
      ) : null}
      {!ready && !textBusy && !textError ? (
        <Button
          label={
            needsKey
              ? "Ya he configurado la conexión · Crear capítulo"
              : "Crear mi novela"
          }
          onPress={() => void start()}
        />
      ) : null}
      <Txt style={{ color: colors.muted, fontSize: 11 }}>
        Una portada para tu novela. Los capítulos contienen solo texto.
      </Txt>
    </Page>
  );
}
