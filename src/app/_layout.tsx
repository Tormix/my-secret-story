import React from "react";
import { ActivityIndicator, View, Image, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { CormorantGaramond_600SemiBold } from "@expo-google-fonts/cormorant-garamond";
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
} from "@expo-google-fonts/manrope";
import { Store, useStore } from "../state/Store";
import {
  Button,
  colors,
  ErrorNotice,
  Eyebrow,
  Page,
  Title,
  Txt,
  useCopy,
} from "../components/ui";
import { art } from "../data/assets";
function Shell() {
  const { state, ready, error, change } = useStore(),
    t = useCopy();
  const [fonts, fontError] = useFonts({
    Cormorant: CormorantGaramond_600SemiBold,
    Manrope: Manrope_400Regular,
    ManropeBold: Manrope_600SemiBold,
  });
  if (error)
    return (
      <Page>
        <Title>My Secret Story</Title>
        <ErrorNotice
          message={t(
            "No se pudieron abrir los datos. Reinicia la app; no se han borrado.",
            "Could not open local data. Restart the app; it has not been erased.",
          )}
        />
      </Page>
    );
  if (!ready || (!fonts && !fontError))
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.rose} />
      </View>
    );
  if (!state.settings.adultConfirmed)
    return (
      <Page>
        <View style={{ height: 310, borderRadius: 24, overflow: "hidden" }}>
          <Image
            source={art.detective.cover}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        </View>
        <Eyebrow>MY SECRET STORY · 18+</Eyebrow>
        <Title>
          {t(
            "No leas una historia de amor. Vive la tuya.",
            "Do not just read a love story. Live yours.",
          )}
        </Title>
        <Txt style={{ color: colors.muted }}>
          {t(
            "Una demo privada de historias donde tú decides. Solo para personas adultas. Tus datos se guardan en este dispositivo. Si eliges generar con API, se enviará el contexto a OpenAI.",
            "A private demo of stories shaped by you. Adults only. Your data stays on this device. If you choose API generation, story context is sent to OpenAI.",
          )}
        </Txt>
        <Button
          label={t("Tengo 18 años o más · Entrar", "I am 18 or older · Enter")}
          onPress={() =>
            void change((s) => ({
              ...s,
              settings: { ...s.settings, adultConfirmed: true },
            }))
          }
        />
        <Button
          secondary
          label={t("English", "Español")}
          onPress={() =>
            void change((s) => ({
              ...s,
              settings: {
                ...s.settings,
                lang: s.settings.lang === "es" ? "en" : "es",
              },
            }))
          }
        />
      </Page>
    );
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: "fade",
        }}
      />
    </>
  );
}
export default function Layout() {
  return (
    <SafeAreaProvider>
      <Store>
        <Shell />
      </Store>
    </SafeAreaProvider>
  );
}
