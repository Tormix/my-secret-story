import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useStore } from "../state/Store";
import { catalogImages, titledCatalogIds } from "../data/catalog-images";
import { getStory } from "../data/catalog";
import type { Novel, Lang, Universe } from "../domain/types";
import { colors, Txt } from "./ui";
export function CoverArt({
  novel,
  universe,
  lang = "es",
  width = 300,
  onLoad,
}: {
  novel?: Novel;
  universe?: Universe;
  lang?: Lang;
  width?: number;
  onLoad?: () => void;
}) {
  const { state } = useStore();
  const id = novel?.universe || universe || "detective",
    story = getStory(id),
    h = width * 1.5;
  if (!novel?.cover && titledCatalogIds.includes(id)) {
    return (
      <View
        style={{
          width,
          height: h,
          borderRadius: 9,
          overflow: "hidden",
          backgroundColor: colors.panel,
        }}
      >
        <Image
          source={{ uri: catalogImages[id] }}
          accessibilityLabel={`Portada de ${story.title[lang]}`}
          style={{ width, height: h }}
          resizeMode="contain"
          onLoad={onLoad}
        />
      </View>
    );
  }
  return (
    <View
      collapsable={false}
      style={{
        width,
        height: h,
        backgroundColor: colors.bg,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <Image
        source={{
          uri:
            novel?.cover ||
            state.settings.catalogCovers?.[id] ||
            catalogImages[id],
        }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onLoad={onLoad}
      />
      <LinearGradient
        colors={["#100a1220", "#140b1530", "#140b15ef", "#140b15"]}
        locations={[0, 0.35, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          position: "absolute",
          inset: 12,
          borderWidth: 1,
          borderColor: "#d7ba8466",
          borderRadius: 8,
        }}
      />
      <Txt
        style={{
          position: "absolute",
          top: 26,
          alignSelf: "center",
          fontSize: width * 0.043,
          letterSpacing: width * 0.006,
          color: colors.cream,
        }}
      >
        MY SECRET STORY
      </Txt>
      <View
        style={{
          position: "absolute",
          bottom: 24,
          left: 25,
          right: 25,
          gap: 9,
        }}
      >
        <Txt style={{ fontSize: 9, letterSpacing: 2, color: colors.gold }}>
          {(
            novel?.adventure?.loveInterestRole || story.role[lang]
          ).toUpperCase()}
        </Txt>
        <Txt
          style={{
            fontFamily: "Cormorant",
            fontSize: width * 0.137,
            lineHeight: width * 0.139,
            color: colors.cream,
          }}
        >
          {novel?.blueprint?.title || story.title[lang]}
        </Txt>
        <View
          style={{
            width: 36,
            height: 1,
            backgroundColor: colors.gold,
            marginVertical: 4,
          }}
        />
        <Txt style={{ fontSize: width * 0.035, color: colors.rose }}>
          {novel
            ? `${lang === "es" ? "Protagonizada por" : "A story by"} ${novel.profile.name}`
            : story.tagline[lang]}
        </Txt>
      </View>
    </View>
  );
}
