import { novelParagraphs } from "../domain/novel-layout";
import React from "react";
import { View } from "react-native";
import { colors, Eyebrow, Txt } from "./ui";
export function ChapterDraft({
  paragraphs,
  fontSize = 21,
  ink = colors.cream,
  complete = false,
}: {
  paragraphs: string[];
  fontSize?: number;
  ink?: string;
  complete?: boolean;
}) {
  if (!paragraphs.length) return null;
  return (
    <View style={{ gap: 20 }}>
      <Eyebrow>
        {complete ? "CAPÍTULO GUARDADO" : "YA PUEDES EMPEZAR A LEER"}
      </Eyebrow>
      <Txt style={{ fontSize: 11, color: colors.muted }}>
        {complete
          ? "Tu capítulo ya está guardado. Abre el lector para tomar tu decisión."
          : "Borrador en curso. Se guarda al completarse y las decisiones aparecen después."}
      </Txt>
      {novelParagraphs(paragraphs).map((text, i) => (
        <Txt
          key={i}
          selectable
          style={{
            fontFamily: "Cormorant",
            fontSize,
            lineHeight: fontSize * 1.65,
            color: ink,
            textAlign: "justify",
          }}
        >
          {text}
        </Txt>
      ))}
    </View>
  );
}
