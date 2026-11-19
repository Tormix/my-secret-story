import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  AccessibilityInfo,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../state/Store";
export const colors = {
  bg: "#130e13",
  panel: "#221720",
  border: "#44303c",
  rose: "#efb8c5",
  muted: "#bba8b2",
  cream: "#f5e8de",
  gold: "#cfb786",
  wine: "#7d2745",
};
export const useCopy = () => {
  const { state } = useStore();
  return (es: string, en: string) => (state.settings.lang === "es" ? es : en);
};
export function Txt({
  children,
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: "Manrope",
          fontSize: 14,
          color: colors.cream,
          lineHeight: 22,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Title({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: TextStyle;
}) {
  return (
    <Txt
      accessibilityRole="header"
      style={[{ fontFamily: "Cormorant", fontSize: 40, lineHeight: 42 }, style]}
    >
      {children}
    </Txt>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Txt
      style={{
        fontSize: 10,
        letterSpacing: 2.6,
        color: colors.gold,
        lineHeight: 20,
      }}
    >
      {children}
    </Txt>
  );
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
  loading = false,
  icon,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}) {
  const scale = useState(() => new Animated.Value(1))[0];
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      mounted = false;
      sub.remove();
      scale.stopAnimation();
    };
  }, [scale]);
  const animate = (value: number) => {
    scale.stopAnimation();
    if (reduced) scale.setValue(1);
    else
      Animated.spring(scale, {
        toValue: value,
        stiffness: 380,
        damping: 28,
        mass: 0.7,
        useNativeDriver: true,
      }).start();
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled || loading}
        onPress={onPress}
        onPressIn={() => animate(0.975)}
        onPressOut={() => animate(1)}
        style={({ pressed }) => [
          {
            minHeight: 52,
            borderRadius: 14,
            paddingHorizontal: 19,
            paddingVertical: 13,
            backgroundColor: secondary ? colors.panel : colors.rose,
            borderWidth: 1,
            borderColor: secondary ? colors.border : colors.rose,
            opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
          },
          loading && { opacity: 0.7 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={secondary ? colors.rose : colors.bg} />
        ) : icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={secondary ? colors.rose : colors.bg}
          />
        ) : null}
        <Txt
          style={{
            fontFamily: "ManropeBold",
            fontSize: 13,
            color: secondary ? colors.cream : colors.bg,
            textAlign: "center",
          }}
        >
          {label}
        </Txt>
      </Pressable>
    </Animated.View>
  );
}
export function IconButton({
  name,
  label,
  onPress,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        width: 46,
        height: 46,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 23,
        backgroundColor: "#231923",
      }}
    >
      <Ionicons name={name} size={20} color={colors.cream} />
    </Pressable>
  );
}
export function Page({
  children,
  title,
  back = false,
  onBack,
}: {
  children: React.ReactNode;
  title?: string;
  back?: boolean;
  onBack?: () => void;
}) {
  const insets = useSafeAreaInsets(),
    t = useCopy();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: Math.max(insets.bottom, 24) + 24,
          paddingHorizontal: 24,
          gap: 22,
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {back ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <IconButton
              name="arrow-back"
              label={t("Volver", "Back")}
              onPress={
                onBack ??
                (() =>
                  router.canGoBack() ? router.back() : router.replace("/"))
              }
            />
            {title ? <Txt style={{ color: colors.muted }}>{title}</Txt> : null}
          </View>
        ) : null}
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Panel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.panel,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 20,
          gap: 12,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
export function Field({
  label,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Txt style={{ color: colors.muted, fontSize: 12 }}>{label}</Txt>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#96818e"
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[
          {
            minHeight: 52,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: focused ? colors.rose : colors.border,
            padding: 14,
            color: colors.cream,
            fontSize: 16,
            fontFamily: "Manrope",
            backgroundColor: colors.panel,
          },
          props.style,
        ]}
      />
    </View>
  );
}
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        minHeight: 46,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: selected ? colors.rose : colors.border,
        backgroundColor: selected ? "#4b2639" : colors.panel,
      }}
    >
      <Txt
        style={{ fontSize: 12, color: selected ? colors.rose : colors.muted }}
      >
        {label}
      </Txt>
    </Pressable>
  );
}
export function Row({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 9,
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
}
export function ErrorNotice({ message }: { message: string }) {
  return (
    <Panel style={{ borderColor: "#c46b71" }}>
      <Txt style={{ color: "#ffb9bd" }}>{message}</Txt>
    </Panel>
  );
}
export function ask(title: string, message: string, action: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(title + "\n" + message)) action();
    return;
  }
  Alert.alert(title, message, [
    { text: "Cancelar / Cancel", style: "cancel" },
    { text: "Confirmar / Confirm", style: "destructive", onPress: action },
  ]);
}
export const styles = StyleSheet.create({
  muted: { color: colors.muted },
  body: { lineHeight: 24 },
  rule: { height: 1, backgroundColor: colors.border },
  heading: { fontSize: 30, lineHeight: 34 },
  gap: { gap: 16 },
});
