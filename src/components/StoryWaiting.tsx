import React, { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Easing, View } from "react-native";
import { colors, Txt } from "./ui";
const phrases = [
  "Shhh… hay una historia latiendo para ti.",
  "Serás la próxima protagonista.",
  "Algunos secretos empiezan con un latido.",
  "Una mirada. Un latido. Tu historia.",
];
export function StoryWaiting({
  phase,
  seconds = 0,
}: {
  phase: string;
  seconds?: number;
}) {
  const [beat] = useState(() => new Animated.Value(0));
  const [index, setIndex] = useState(0);
  useEffect(() => {
    let disposed = false;
    const tick = (toValue: number, duration: number) =>
      Animated.timing(beat, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      });
    // A single double heartbeat, followed by a pause; every visual follows this one value.
    const motion = Animated.loop(
      Animated.sequence([
        tick(1, 130),
        tick(0, 150),
        tick(0.7, 120),
        tick(0, 240),
        Animated.delay(1080),
      ]),
    );
    void AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!disposed) {
        if (reduce) beat.setValue(0.5);
        else motion.start();
      }
    });
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % phrases.length),
      5500,
    );
    return () => {
      disposed = true;
      motion.stop();
      clearInterval(timer);
    };
  }, [beat]);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={phase}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 82,
          height: 82,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: 74,
            height: 74,
            borderRadius: 37,
            borderWidth: 1,
            borderColor: colors.rose,
            opacity: beat.interpolate({
              inputRange: [0, 1],
              outputRange: [0.15, 0.55],
            }),
            transform: [
              {
                scale: beat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.88, 1.12],
                }),
              },
            ],
          }}
        />
        <Animated.View
          style={{
            width: 68,
            height: 68,
            alignItems: "center",
            justifyContent: "center",
            transform: [
              {
                scale: beat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.14],
                }),
              },
            ],
          }}
        >
          <Txt style={{ fontSize: 61, lineHeight: 70, color: colors.rose }}>
            ♥
          </Txt>
          <View
            style={{
              position: "absolute",
              top: 25,
              width: 9,
              height: 9,
              borderRadius: 5,
              backgroundColor: colors.bg,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 31,
              width: 5,
              height: 11,
              borderRadius: 1,
              backgroundColor: colors.bg,
            }}
          />
        </Animated.View>
      </View>
      <View style={{ flex: 1, gap: 8 }}>
        <Txt style={{ color: colors.gold, fontSize: 9, letterSpacing: 2 }}>
          SOLO TÚ CONOCES EL SECRETO
        </Txt>
        <Txt style={{ color: colors.cream, fontSize: 15, lineHeight: 21 }}>
          {phrases[index]}
        </Txt>
        <Txt style={{ color: colors.muted, fontSize: 11 }}>
          {phase}
          {seconds > 0 ? ` · ${Math.floor(seconds)} s` : ""}
        </Txt>
      </View>
    </View>
  );
}
