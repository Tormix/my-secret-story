import { novelParagraphs } from "../../domain/novel-layout";
import { ParagraphStream } from "../../services/chatgpt/paragraph-stream";
import { ChapterDraft } from "../../components/ChapterDraft";
import {
  chapterCount,
  commitBlueprint,
  commitChapter,
} from "../../domain/adventure";
import React, { useEffect, useRef, useState } from "react";
import { AppState, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../../state/Store";
import {
  Button,
  Chip,
  colors,
  ErrorNotice,
  Eyebrow,
  IconButton,
  Panel,
  Row,
  Title,
  Txt,
  useCopy,
} from "../../components/ui";
import { StoryWaiting } from "../../components/StoryWaiting";
import { narrative } from "../../services/narrative";
import { getStory } from "../../data/catalog";
import {
  generateChapter,
  generateBlueprint,
  generateAdventureChapter,
  translateChapter,
} from "../../services/chatgpt/client";
import { finish, selectChoice, unlock } from "../../domain/engine";
import type { Choice } from "../../domain/types";
function AutoStart({
  enabled,
  onStart,
}: {
  enabled: boolean;
  onStart: () => void;
}) {
  const started = useRef(false);
  useEffect(() => {
    if (enabled && !started.current) {
      started.current = true;
      onStart();
    }
  }, [enabled, onStart]);
  return null;
}
export default function Reader() {
  const { id, auto } = useLocalSearchParams<{ id: string; auto?: string }>(),
    { state, change } = useStore(),
    t = useCopy(),
    n = state.novels.find((n) => n.id === id),
    insets = useSafeAreaInsets(),
    [viewChapter, setViewChapter] = useState(
      n?.readingChapter ?? n?.chapter ?? 0,
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [phase, setPhase] = useState(""),
    [draft, setDraft] = useState<string[]>([]),
    [seconds, setSeconds] = useState(0),
    abort = useRef<AbortController | null>(null),
    scroll = useRef<React.ComponentRef<typeof ScrollView>>(null),
    y = useRef(n?.scroll[String(n?.readingChapter ?? n?.chapter ?? 0)] || 0),
    [initialOffset, setInitialOffset] = useState({
      x: 0,
      y: n?.scroll[String(n?.readingChapter ?? n?.chapter ?? 0)] || 0,
    }),
    restorePending = useRef(true),
    contentHeight = useRef(0),
    viewportHeight = useRef(0),
    activeChapter = useRef(viewChapter),
    transition = useRef(false),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lang = state.settings.lang,
    dark = state.settings.darkReader,
    bg = dark ? "#161016" : "#f5ecdf",
    ink = dark ? "#e6d8cf" : "#382733",
    muted = dark ? colors.muted : "#795c68";
  useEffect(() => {
    void change((s) => ({
      ...s,
      novels: s.novels.map((x) =>
        x.id === id ? { ...x, updatedAt: new Date().toISOString() } : x,
      ),
    }));
    const persist = () => {
      if (timer.current) clearTimeout(timer.current);
      const chapter = activeChapter.current,
        offset = Math.max(0, y.current);
      void change((s) => ({
        ...s,
        novels: s.novels.map((x) =>
          x.id === id
            ? {
                ...x,
                readingChapter: chapter,
                scroll: { ...x.scroll, [String(chapter)]: offset },
              }
            : x,
        ),
      })).catch(() => {});
    };
    const subscription = AppState.addEventListener("change", (status) => {
      if (status !== "active") persist();
    });
    return () => {
      subscription.remove();
      persist();
      abort.current?.abort();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [id, change]);
  useEffect(() => {
    if (!busy) return;
    const start = Date.now(),
      interval = setInterval(
        () => setSeconds((Date.now() - start) / 1000),
        1000,
      );
    return () => clearInterval(interval);
  }, [busy]);
  if (!n)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          padding: 30,
          paddingTop: insets.top + 30,
        }}
      >
        <ErrorNotice
          message={t("Historia no encontrada.", "Story not found.")}
        />
        <Button
          label={t("Biblioteca", "Library")}
          onPress={() => router.replace("/library")}
        />
      </View>
    );
  const novel = n,
    total = chapterCount(n);
  const isAI = n.source === "chatgpt" || n.source === "api",
    canonical = n.generated?.[String(viewChapter)],
    generated =
      n.generated?.[`${viewChapter}-${lang}`] ||
      (canonical?.lang === lang ? canonical : undefined),
    local = isAI
      ? undefined
      : narrative.chapter({ ...n, chapter: viewChapter }, lang),
    paragraphs = isAI ? generated?.paragraphs : local?.paragraphs,
    chapterTitle = isAI
      ? generated?.title ||
        t(`Capítulo ${viewChapter + 1}`, `Chapter ${viewChapter + 1}`)
      : local?.title,
    choices: Choice[] = isAI
      ? (generated?.choices || []).map((c) => ({
          ...c,
          label: { es: c.label, en: c.label },
        }))
      : local?.choices || [];
  const isCurrent = viewChapter === n.chapter,
    positionKey = String(viewChapter);
  async function run(fn: () => Promise<void>) {
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(
        abort.current?.signal.aborted
          ? t(
              "Generación cancelada. Puedes volver a intentarlo; tus capítulos guardados siguen aquí.",
              "Generation cancelled. Retry anytime; your saved chapters are still here.",
            )
          : e instanceof Error && e.message === "PREMIUM"
            ? t(
                "Has terminado los tres capítulos de prueba. Activa Premium demo gratis para continuar.",
                "Your three trial chapters are complete. Enable free demo Premium to continue.",
              )
            : e instanceof Error && e.message === "CREDITS"
              ? t(
                  "Te faltan créditos de demostración. Puedes añadirlos gratis en Premium.",
                  "You need more demo credits. Add them free in Premium.",
                )
              : e instanceof Error
                ? e.message
                : String(e),
      );
    }
  }
  async function generate() {
    setError("");
    if (busy || abort.current || (!isCurrent && !canonical)) return;
    setBusy(true);
    setSeconds(0);
    setDraft([]);
    const preview = new ParagraphStream();
    let shown = 0;
    const onText = (delta: string) => {
      const paragraphs = preview.push(delta);
      if (paragraphs.length > shown && !abort.current?.signal.aborted) {
        shown = paragraphs.length;
        setDraft([...paragraphs]);
      }
    };
    abort.current = new AbortController();
    try {
      if (!state.settings.generationConsent)
        throw new Error(
          t(
            "Autoriza el envío de contexto desde la creación de historia.",
            "Authorize context sharing when creating a story.",
          ),
        );
      if (!state.settings.model)
        throw new Error(
          t("Elige un modelo en Ajustes.", "Choose a model in Settings."),
        );
      let workingNovel = novel;
      if (!canonical && novel.adventure && !novel.blueprint) {
        setPhase(
          t(
            "Preparando la escaleta de tu aventura…",
            "Preparing your adventure outline…",
          ),
        );
        const plan = await generateBlueprint(
          novel,
          lang,
          state.settings.model,
          () => {},
          abort.current.signal,
        );
        if (abort.current.signal.aborted) throw new Error("Cancelled");
        await change((s) => ({
          ...s,
          novels: s.novels.map((x) =>
            x.id === id ? commitBlueprint(x, novel.generationId, plan) : x,
          ),
        }));
        workingNovel = { ...novel, blueprint: plan, memory: plan.memory };
      }
      setPhase(
        canonical
          ? t("Traduciendo el capítulo…", "Translating the chapter…")
          : t(
              "Escribiendo tu capítulo y actualizando la memoria…",
              "Writing your chapter and updating memory…",
            ),
      );
      const result = canonical
        ? await translateChapter(
            canonical,
            lang,
            state.settings.model,
            onText,
            abort.current.signal,
          )
        : await (novel.adventure ? generateAdventureChapter : generateChapter)(
            workingNovel,
            lang,
            state.settings.model,
            onText,
            abort.current.signal,
          );
      const chapterKey = canonical
        ? `${viewChapter}-${lang}`
        : String(viewChapter);
      if (abort.current.signal.aborted) throw new Error("Cancelled");
      await change((s) => ({
        ...s,
        novels: s.novels.map((x) =>
          x.id === id
            ? !canonical && novel.adventure
              ? commitChapter(x, novel.generationId, viewChapter, result)
              : {
                  ...x,
                  generated: { ...x.generated, [chapterKey]: result },
                  updatedAt: new Date().toISOString(),
                }
            : x,
        ),
      }));
    } catch (e) {
      setError(
        abort.current?.signal.aborted
          ? t(
              "Generación cancelada. Puedes volver a intentarlo; tus capítulos guardados siguen aquí.",
              "Generation cancelled. Retry anytime; your saved chapters are still here.",
            )
          : e instanceof Error && e.message === "PREMIUM"
            ? t(
                "Has terminado los tres capítulos de prueba. Activa Premium demo gratis para continuar.",
                "Your three trial chapters are complete. Enable free demo Premium to continue.",
              )
            : e instanceof Error && e.message === "CREDITS"
              ? t(
                  "Te faltan créditos de demostración. Puedes añadirlos gratis en Premium.",
                  "You need more demo credits. Add them free in Premium.",
                )
              : e instanceof Error
                ? e.message
                : String(e),
      );
    } finally {
      abort.current = null;
      setBusy(false);
    }
  }
  async function choose(choice: Choice) {
    if (busy || transition.current || !isCurrent) return;
    transition.current = true;
    try {
      await change((s) => {
        if (s.novels.find((x) => x.id === id)?.chapter !== viewChapter)
          return s;
        const unlocked = unlock(s, id);
        return {
          ...unlocked,
          novels: unlocked.novels.map((x) =>
            x.id === id
              ? {
                  ...selectChoice(x, choice),
                  readingChapter: viewChapter + 1,
                  scroll: { ...x.scroll, [positionKey]: y.current },
                }
              : x,
          ),
        };
      });
      switchChapter(viewChapter + 1, 0);
    } finally {
      transition.current = false;
    }
  }
  function switchChapter(ch: number, offset: number) {
    setDraft([]);
    if (timer.current) clearTimeout(timer.current);
    restorePending.current = true;
    contentHeight.current = 0;
    viewportHeight.current = 0;
    activeChapter.current = ch;
    y.current = offset;
    setInitialOffset({ x: 0, y: offset });
    setError("");
    setViewChapter(ch);
  }
  function restorePosition() {
    if (
      !restorePending.current ||
      !contentHeight.current ||
      !viewportHeight.current
    )
      return;
    const offset = Math.min(
      initialOffset.y,
      Math.max(0, contentHeight.current - viewportHeight.current),
    );
    restorePending.current = false;
    y.current = offset;
    scroll.current?.scrollTo({ y: offset, animated: false });
  }
  function savePosition(offset: number) {
    if (restorePending.current || activeChapter.current !== viewChapter) return;
    offset = Math.max(0, offset);
    y.current = offset;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void change((s) => ({
        ...s,
        novels: s.novels.map((x) =>
          x.id === id
            ? {
                ...x,
                readingChapter: viewChapter,
                scroll: { ...x.scroll, [positionKey]: offset },
              }
            : x,
        ),
      })).catch(() =>
        setError(
          t("No se pudo guardar la posición.", "Could not save your position."),
        ),
      );
    }, 500);
  }
  function navigate(ch: number) {
    if (busy) return;
    if (timer.current) clearTimeout(timer.current);
    const previousOffset = y.current;
    void change((s) => ({
      ...s,
      novels: s.novels.map((x) =>
        x.id === id
          ? {
              ...x,
              readingChapter: ch,
              scroll: { ...x.scroll, [positionKey]: previousOffset },
            }
          : x,
      ),
    })).catch(() =>
      setError(
        t("No se pudo guardar la posición.", "Could not save your position."),
      ),
    );
    switchChapter(ch, novel.scroll[String(ch)] || 0);
  }
  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top }}>
      <View
        style={{
          paddingHorizontal: 18,
          paddingVertical: 10,
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: dark ? colors.border : "#dfccbf",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <IconButton
            name="arrow-back"
            label={t("Volver a biblioteca", "Back to library")}
            onPress={() => {
              abort.current?.abort();
              if (timer.current) clearTimeout(timer.current);
              void change((s) => ({
                ...s,
                novels: s.novels.map((x) =>
                  x.id === id
                    ? {
                        ...x,
                        scroll: { ...x.scroll, [positionKey]: y.current },
                      }
                    : x,
                ),
              }))
                .then(() => router.replace("/library"))
                .catch((e) => setError(String(e)));
            }}
          />
          <View style={{ flex: 1 }}>
            <Txt style={{ fontSize: 11, color: muted }}>
              {n.blueprint?.title || getStory(n.universe).title[lang]}
            </Txt>
            <Txt style={{ fontSize: 12, color: muted }}>
              {t("CAPÍTULO", "CHAPTER")} {viewChapter + 1} / {total}
            </Txt>
          </View>
          <IconButton
            name={dark ? "sunny-outline" : "moon-outline"}
            label={t("Cambiar modo de lectura", "Toggle reader theme")}
            onPress={() =>
              void change((s) => ({
                ...s,
                settings: { ...s.settings, darkReader: !s.settings.darkReader },
              }))
            }
          />
        </View>
        <View
          style={{
            height: 2,
            backgroundColor: dark ? colors.border : "#dfccbf",
          }}
        >
          <View
            style={{
              height: 2,
              width: `${novel.completed ? 100 : Math.round(((viewChapter + 1) / total) * 100)}%`,
              backgroundColor: colors.rose,
            }}
          />
        </View>
        <Row>
          <Chip
            selected={false}
            label="A−"
            onPress={() =>
              void change((s) => ({
                ...s,
                settings: {
                  ...s.settings,
                  fontSize: Math.max(15, s.settings.fontSize - 1),
                },
              }))
            }
          />
          <Chip
            selected={false}
            label="A+"
            onPress={() =>
              void change((s) => ({
                ...s,
                settings: {
                  ...s.settings,
                  fontSize: Math.min(30, s.settings.fontSize + 1),
                },
              }))
            }
          />
        </Row>
      </View>
      <AutoStart
        key={`auto-${id}-${viewChapter}`}
        enabled={auto === "1" && isCurrent && !canonical}
        onStart={() => void generate()}
      />
      <ScrollView
        key={`${id}-${viewChapter}`}
        ref={scroll}
        bounces={false}
        overScrollMode="never"
        onScroll={(e) => savePosition(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={250}
        onLayout={(e) => {
          viewportHeight.current = e.nativeEvent.layout.height;
          restorePosition();
        }}
        onContentSizeChange={(_, height) => {
          contentHeight.current = height;
          restorePosition();
        }}
        contentContainerStyle={{
          padding: 28,
          paddingBottom: insets.bottom + 40,
          gap: 22,
          maxWidth: 740,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <Eyebrow>
          {n.adventure?.setting || getStory(n.universe).setting[lang]}
        </Eyebrow>
        {n.adventure && !paragraphs && n.blueprint ? (
          <Panel>
            <Eyebrow>{t("TU AVENTURA", "YOUR ADVENTURE")}</Eyebrow>
            <Title style={{ fontSize: 29, lineHeight: 32 }}>
              {n.blueprint.title}
            </Title>
            <Txt>{n.blueprint.synopsis}</Txt>
            <Txt style={{ fontSize: 11, color: colors.muted }}>
              {t(
                "Escaleta guardada; continuará aunque canceles el capítulo.",
                "Outline saved; it remains if you cancel the chapter.",
              )}
            </Txt>
          </Panel>
        ) : null}
        <Title style={{ color: ink, fontSize: 40, lineHeight: 43 }}>
          {chapterTitle}
        </Title>
        {!paragraphs && draft.length > 0 ? (
          <ChapterDraft
            paragraphs={draft}
            fontSize={state.settings.fontSize}
            ink={ink}
          />
        ) : null}
        {!paragraphs ? (
          <Panel>
            <Eyebrow>
              {canonical
                ? t("TRADUCIR ESTE CAPÍTULO", "TRANSLATE THIS CHAPTER")
                : t("TU PRÓXIMO CAPÍTULO", "YOUR NEXT CHAPTER")}
            </Eyebrow>
            <Txt>
              {t(
                "La IA escribirá a partir de tu perfil y tus decisiones. Solo guardaremos el capítulo cuando termine correctamente.",
                "The AI will write from your profile and decisions. The chapter will be saved only after successful completion.",
              )}
            </Txt>
            {busy ? (
              <>
                <StoryWaiting
                  phase={phase || "Preparando tu historia…"}
                  seconds={seconds}
                />
                <Button
                  secondary
                  label={t("Cancelar generación", "Cancel generation")}
                  onPress={() => abort.current?.abort()}
                />
              </>
            ) : (
              <Button
                label={
                  error
                    ? t("Volver a intentar", "Try again")
                    : canonical
                      ? t("Traducir con API", "Translate with API")
                      : t(
                          "Generar mi siguiente episodio",
                          "Generate my next episode",
                        )
                }
                onPress={() => void generate()}
              />
            )}
            <Button
              secondary
              label={t("Ajustes de conexión", "Connection settings")}
              onPress={() => router.push("/settings")}
            />
          </Panel>
        ) : (
          <>
            {novelParagraphs(paragraphs).map((p, i) => (
              <React.Fragment key={`${viewChapter}-${lang}-${i}`}>
                <Txt
                  selectable
                  style={{
                    fontSize: state.settings.fontSize,
                    lineHeight: state.settings.fontSize * 1.65,
                    color: ink,
                    fontFamily: "Cormorant",
                    textAlign: "justify",
                  }}
                >
                  {p}
                </Txt>
              </React.Fragment>
            ))}
            {isCurrent && viewChapter < total - 1 ? (
              <Panel>
                <Eyebrow>
                  {t("EL SIGUIENTE PASO ES TUYO", "THE NEXT STEP IS YOURS")}
                </Eyebrow>
                <Title style={{ fontSize: 29, lineHeight: 32 }}>
                  {t("¿Qué decides?", "What do you choose?")}
                </Title>
                {!n.unlocked.includes(viewChapter + 1) ? (
                  <Txt style={{ fontSize: 12, color: colors.muted }}>
                    {n.adventure
                      ? t(
                          "Tres capítulos de prueba. Desde el cuarto, activa Premium demo gratis; no hay cobros reales.",
                          "Three trial chapters. From chapter four, enable free demo Premium; no real charges.",
                        )
                      : t(
                          "Elegir desbloquea el siguiente capítulo por 3 créditos ficticios. Puedes añadirlos gratis en Premium; no hay pagos reales.",
                          "Choosing unlocks the next chapter for 3 demo credits. Demo Premium: no cost.",
                        )}
                  </Txt>
                ) : null}
                {choices.map((c) => (
                  <Button
                    secondary
                    key={c.id}
                    label={c.label[lang]}
                    onPress={() => void run(() => choose(c))}
                  />
                ))}
                {!state.wallet.premium &&
                (n.adventure ? viewChapter >= 2 : state.wallet.credits < 3) &&
                !n.unlocked.includes(viewChapter + 1) ? (
                  <Button
                    label={t(
                      n.adventure
                        ? "Activar Premium de prueba"
                        : "Conseguir créditos de demostración",
                      n.adventure ? "Enable trial Premium" : "Get demo credits",
                    )}
                    onPress={() => router.push("/plans")}
                  />
                ) : null}
              </Panel>
            ) : null}
            {viewChapter === total - 1 ? (
              <Panel>
                <Eyebrow>
                  {n.completed
                    ? t("FINAL DESCUBIERTO", "ENDING DISCOVERED")
                    : t(
                        "EL FINAL DE ESTE RECORRIDO",
                        "THE END OF THIS JOURNEY",
                      )}
                </Eyebrow>
                <Title style={{ fontSize: 29, lineHeight: 32 }}>
                  {n.adventure
                    ? t("Tu propio desenlace", "Your own ending")
                    : n.trust >= 2
                      ? t("Elegirse, de nuevo", "Choosing each other again")
                      : t("Elegirte, también", "Choosing yourself, too")}
                </Title>
                <Txt style={{ color: colors.muted }}>
                  {t(
                    "Tus decisiones han dibujado este desenlace. Puedes iniciar otra aventura o reiniciar desde la biblioteca.",
                    "Your choices shaped this ending. Restart in your library to explore another path.",
                  )}
                </Txt>
                <Button
                  label={t(
                    "Guardar final y volver a biblioteca",
                    "Save ending and return to library",
                  )}
                  onPress={() =>
                    void run(async () => {
                      await change((s) => ({
                        ...s,
                        novels: s.novels.map((x) =>
                          x.id === id ? finish(x) : x,
                        ),
                      }));
                      router.replace("/library");
                    })
                  }
                />
              </Panel>
            ) : null}
          </>
        )}
        {error ? <ErrorNotice message={error} /> : null}
        <Row>
          {viewChapter > 0 ? (
            <Chip
              label={t("← Capítulo anterior", "← Previous chapter")}
              selected={false}
              onPress={() => navigate(viewChapter - 1)}
            />
          ) : null}
          {viewChapter < n.chapter ? (
            <Chip
              label={t("Siguiente capítulo →", "Next chapter →")}
              selected={false}
              onPress={() => navigate(viewChapter + 1)}
            />
          ) : null}
        </Row>
      </ScrollView>
    </View>
  );
}
