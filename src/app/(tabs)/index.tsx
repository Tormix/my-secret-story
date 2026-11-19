import React, { useState } from "react";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useStore } from "../../state/Store";
import {
  Button,
  Chip,
  colors,
  Eyebrow,
  Page,
  Title,
  Txt,
} from "../../components/ui";
import { CoverArt } from "../../components/CoverArt";
import { templates } from "../../data/templates";
import { chapterCount } from "../../domain/adventure";
export default function Home() {
  const { state } = useStore(),
    [filter, setFilter] = useState("Todas"),
    { width } = useWindowDimensions();

  const cardWidth = (Math.min(width, 760) - 64) / 2;
  const last = [...state.novels]
    .filter((n) => !n.completed)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const open = (id: string) =>
    router.push({ pathname: "/story/[id]", params: { id } });
  return (
    <Page>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Txt
            style={{ fontFamily: "Cormorant", fontSize: 29, lineHeight: 34 }}
          >
            My Secret Story
          </Txt>
          <Txt style={{ fontSize: 9, letterSpacing: 2, color: colors.muted }}>
            ESTA VEZ, LA PROTAGONISTA ERES TÚ
          </Txt>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir ajustes"
          onPress={() => router.push("/settings")}
          style={{ padding: 12 }}
        >
          <Ionicons name="settings-outline" color={colors.rose} size={23} />
        </Pressable>
      </View>
      {last ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continuar mi historia"
          onPress={() =>
            router.push({
              pathname:
                last.source === "api" && !last.generated?.["0"]
                  ? "/prepare/[id]"
                  : "/read/[id]",
              params: { id: last.id },
            })
          }
          style={{
            flexDirection: "row",
            gap: 15,
            padding: 15,
            backgroundColor: colors.panel,
            borderRadius: 18,
          }}
        >
          <CoverArt novel={last} width={66} />
          <View style={{ flex: 1, justifyContent: "center", gap: 7 }}>
            <Eyebrow>SIGUE DONDE LO DEJASTE</Eyebrow>
            <Txt
              style={{ fontFamily: "Cormorant", fontSize: 24, lineHeight: 27 }}
            >
              {last.blueprint?.title ||
                last.adventure?.goal ||
                templates.find((t) => t.id === last.universe)?.title}
            </Txt>
            <Txt style={{ fontSize: 11, color: colors.muted }}>
              Capítulo {(last.readingChapter ?? last.chapter) + 1} de{" "}
              {chapterCount(last)}
            </Txt>
            <View
              style={{
                height: 3,
                backgroundColor: colors.border,
                borderRadius: 2,
              }}
            >
              <View
                style={{
                  height: 3,
                  width: `${Math.min(100, ((last.chapter + 1) / chapterCount(last)) * 100)}%`,
                  backgroundColor: colors.rose,
                }}
              />
            </View>
            <Txt style={{ fontSize: 12, color: colors.rose }}>
              Continuar leyendo →
            </Txt>
          </View>
        </Pressable>
      ) : null}
      <View
        style={{
          backgroundColor: "#392033",
          borderRadius: 24,
          padding: 22,
          gap: 16,
          overflow: "hidden",
        }}
      >
        <Eyebrow>EL PRIMER FLECHAZO LO ELIGES TÚ</Eyebrow>
        <Title style={{ fontSize: 44, lineHeight: 44 }}>
          Tu próxima historia{"\n"}lleva tu nombre.
        </Title>
        <Txt style={{ fontSize: 12, color: "#decbd5" }}>
          Un café que se alarga. Una mirada inesperada. Elige qué te apetece
          vivir.
        </Txt>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingVertical: 8 }}
        >
          {["detective", "highlands", "lawyer"].map((id) => (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={`Ver ${templates.find((t) => t.id === id)?.title}`}
              onPress={() => open(id)}
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <CoverArt
                universe={templates.find((t) => t.id === id)!.id}
                width={Math.min(180, (width - 110) * 0.62)}
              />
            </Pressable>
          ))}
        </ScrollView>
        <Txt style={{ color: colors.rose, fontSize: 11, textAlign: "center" }}>
          Toca una portada para descubrir la historia →
        </Txt>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        {["Elige historia", "Dale tu nombre", "Empieza a leer"].map((s, i) => (
          <View
            key={s}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <Txt
              style={{
                backgroundColor: i === 0 ? colors.rose : colors.panel,
                color: i === 0 ? colors.bg : colors.muted,
                width: 22,
                height: 22,
                borderRadius: 11,
                textAlign: "center",
                fontSize: 10,
              }}
            >
              {i + 1}
            </Txt>
            <Txt
              style={{
                fontSize: 9,
                color: i === 0 ? colors.cream : colors.muted,
              }}
            >
              {s}
            </Txt>
          </View>
        ))}
      </View>
      <View style={{ gap: 5 }}>
        <Eyebrow>DIEZ HISTORIAS POR DESCUBRIR</Eyebrow>
        <Title style={{ fontSize: 35, lineHeight: 37 }}>
          ¿Cuál te apetece vivir?
        </Title>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {["Todas", ...new Set(templates.map((t) => t.category))].map((c) => (
          <Chip
            key={c}
            label={c}
            selected={filter === c}
            onPress={() => setFilter(c)}
          />
        ))}
      </ScrollView>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, rowGap: 25 }}
      >
        {templates
          .filter((t) => filter === "Todas" || t.category === filter)
          .map((t) => (
            <Pressable
              key={t.id}
              accessibilityRole="button"
              accessibilityLabel={`Ver ${t.title}`}
              onPress={() => open(t.id)}
              style={{ width: cardWidth, gap: 8 }}
            >
              <CoverArt universe={t.id} width={cardWidth} />
              <Txt style={{ fontSize: 10, color: colors.gold, lineHeight: 15 }}>
                {t.category}
              </Txt>
              <Txt style={{ fontSize: 12, lineHeight: 18 }}>{t.title}</Txt>
              <Txt
                style={{ fontSize: 10, color: colors.muted, lineHeight: 15 }}
              >
                Tú + {t.person.split(" ")[0]}
              </Txt>
            </Pressable>
          ))}
      </View>
      <View style={{ paddingVertical: 24, gap: 12 }}>
        <Title style={{ fontSize: 32, lineHeight: 35, textAlign: "center" }}>
          Hay historias que empiezan{"\n"}con una mirada. Esta, contigo.
        </Title>
        <Txt style={{ fontSize: 11, color: colors.muted, textAlign: "center" }}>
          3 capítulos de prueba · Premium simulado · La generación usa saldo API
          real.
        </Txt>
        <Button
          secondary
          label="Mi biblioteca"
          icon="library-outline"
          onPress={() => router.push("/library")}
        />
      </View>
    </Page>
  );
}
