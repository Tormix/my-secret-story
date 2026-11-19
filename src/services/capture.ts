import { captureRef } from "react-native-view-shot";
import type { ComponentRef, RefObject } from "react";
import { View } from "react-native";
export async function captureCover(
  ref: RefObject<ComponentRef<typeof View> | null>,
) {
  return captureRef(ref.current!, {
    format: "png",
    quality: 1,
    result: "tmpfile",
    width: 1200,
    height: 1800,
  });
}
