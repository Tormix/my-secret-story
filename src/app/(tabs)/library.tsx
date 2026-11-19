import { chapterCount } from "../../domain/adventure";
import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useStore } from "../../state/Store";
import {
  Button,
  Chip,
  colors,
  ErrorNotice,
  Eyebrow,
  Page,
  Panel,
  Row,
  Title,
  Txt,
  useCopy,
  ask,
} from "../../components/ui";
import { CoverArt } from "../../components/CoverArt";
import { getStory } from "../../data/catalog";
import { restart } from "../../domain/engine";
import { pruneMedia } from "../../services/media";
export default function Library() {
  const { state, change } = useStore(),
    t = useCopy(),
    lang = state.settings.lang,
    [filter, setFilter] = useState(false),
    [error, setError] = useState("");
  async function remove(id: string) {
    try {
      const next = {
        ...state,
        novels: state.novels.filter((n) => n.id !== id),
      };
      await change((s) => ({
        ...s,
        novels: s.novels.filter((n) => n.id !== id),
      }));
      await pruneMedia(next);
    } catch (e) {
      setError(String(e));
    }
  }
  return (
    <Page>
      <Eyebrow>{t("TUS OTRAS VIDAS", "YOUR OTHER LIVES")}</Eyebrow>
      <Title>{t("Mi biblioteca", "My library")}</Title>
      <Row>
        <Chip
          selected={!filter}
          label={t("Todas", "All")}
          onPress={() => setFilter(false)}
        />
        <Chip
          selected={filter}
          label={t("Finalizadas", "Finished")}
          onPress={() => setFilter(true)}
        />
      </Row>
      {error ? <ErrorNotice message={error} /> : null}
      {!state.novels.length ? (
        <Panel>
          <Title style={{ fontSize: 29, lineHeight: 32 }}>
            {t(
              "Todo empieza con un encuentro.",
              "It all begins with an encounter.",
            )}
          </Title>
          <Txt style={{ color: colors.muted }}>
            {t(
              "Tus portadas, decisiones y capítulos se quedarán aquí.",
              "Your covers, choices and chapters will live here.",
            )}
          </Txt>
          <Button
            label={t("Descubrir historias", "Discover stories")}
            onPress={() => router.push("/")}
          />
        </Panel>
      ) : null}
      {filter &&
      state.novels.length > 0 &&
      !state.novels.some((n) => n.completed) ? (
        <Panel>
          <Txt>
            {t(
              "Aún no has terminado ninguna historia.",
              "You haven’t finished a story yet.",
            )}
          </Txt>
          <Button
            label={t("Ver mis historias", "See my stories")}
            onPress={() => setFilter(false)}
          />
        </Panel>
      ) : null}
      {[...state.novels]
        .filter((n) => !filter || n.completed)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((n) => (
          <Panel key={n.id}>
            <View style={{ flexDirection: "row", gap: 18 }}>
              <CoverArt novel={n} width={96} lang={lang} />
              <View style={{ flex: 1, gap: 9 }}>
                <Eyebrow>
                  {n.source === "chatgpt" || n.source === "api"
                    ? "CHATGPT"
                    : t("SIN CONEXIÓN", "OFFLINE")}
                </Eyebrow>
                <Title style={{ fontSize: 25, lineHeight: 27 }}>
                  {n.blueprint?.title || getStory(n.universe).title[lang]}
                </Title>
                <Txt style={{ color: colors.muted, fontSize: 12 }}>
                  {n.profile.name} · {t("Cap.", "Ch.")}{" "}
                  {(n.readingChapter ?? n.chapter) + 1}/{chapterCount(n)}
                  {n.completed ? " ✓" : ""}
                </Txt>
                <Txt style={{ color: colors.gold, fontSize: 11 }}>
                  {n.endings.length}
                  {n.adventure ? "" : "/2"}{" "}
                  {t("finales descubiertos", "endings discovered")}
                </Txt>
              </View>
            </View>
            <Button
              label={
                n.completed
                  ? t("Volver a la lectura", "Resume reading")
                  : t("Continuar leyendo", "Continue reading")
              }
              onPress={() =>
                router.push({
                  pathname:
                    n.source === "api" && !n.generated?.["0"]
                      ? "/prepare/[id]"
                      : "/read/[id]",
                  params: { id: n.id },
                })
              }
            />
            <Row>
              <Chip
                selected={false}
                label={t("Portada", "Cover")}
                onPress={() =>
                  router.push({ pathname: "/cover/[id]", params: { id: n.id } })
                }
              />
              <Chip
                selected={false}
                label={t("Reiniciar", "Restart")}
                onPress={() =>
                  ask(
                    t("Reiniciar historia", "Restart story"),
                    t(
                      "Se borrarán las decisiones de este recorrido. Conservarás la portada y los finales descubiertos.",
                      "This playthrough’s choices will be cleared. Your cover and discovered endings remain.",
                    ),
                    () =>
                      void change((s) => ({
                        ...s,
                        novels: s.novels.map((x) =>
                          x.id === n.id ? { ...restart(x), generated: {} } : x,
                        ),
                      })),
                  )
                }
              />
              <Chip
                selected={false}
                label={t("Eliminar", "Delete")}
                onPress={() =>
                  ask(
                    t("Eliminar historia", "Delete story"),
                    t(
                      "Esta acción elimina esta novela de tu dispositivo.",
                      "This removes this novel from your device.",
                    ),
                    () => void remove(n.id),
                  )
                }
              />
            </Row>
          </Panel>
        ))}
    </Page>
  );
}
