import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Novel } from "../domain/types";
import { CoverArt } from "./CoverArt";
import { Button, colors, Txt } from "./ui";
export function CoverViewer({ novel }: { novel: Novel }) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [open, setOpen] = useState(false),
    [zoom, setZoom] = useState(1);
  const coverWidth = Math.min(Math.max(width - 48, 200), 440);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ampliar la portada"
        onPress={() => {
          setZoom(1);
          setOpen(true);
        }}
        style={{ alignSelf: "center" }}
      >
        <CoverArt novel={novel} width={coverWidth} />
        <Txt
          style={{
            textAlign: "center",
            fontSize: 12,
            marginTop: 10,
            color: colors.gold,
          }}
        >
          Toca para ampliar ⤢
        </Txt>
      </Pressable>
      <Modal
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        presentationStyle="fullScreen"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.bg,
            paddingTop: insets.top + 14,
            paddingBottom: Math.max(insets.bottom, 20),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              paddingHorizontal: 16,
            }}
          >
            <Button
              secondary
              label="− Reducir"
              disabled={zoom <= 1}
              onPress={() => setZoom((z) => Math.max(1, z - 0.5))}
            />
            <Button
              secondary
              label="+ Ampliar"
              disabled={zoom >= 3}
              onPress={() => setZoom((z) => Math.min(3, z + 0.5))}
            />
          </View>
          <ScrollView
            style={{ flex: 1 }}
            maximumZoomScale={1}
            nestedScrollEnabled
          >
            <ScrollView
              horizontal
              nestedScrollEnabled
              contentContainerStyle={{
                minWidth: width,
                minHeight: Math.max(height - 190, 0),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CoverArt
                novel={novel}
                width={
                  Math.min(
                    width - 32,
                    Math.max(
                      160,
                      (height - insets.top - insets.bottom - 190) / 1.5,
                    ),
                  ) * zoom
                }
              />
            </ScrollView>
          </ScrollView>
          <View style={{ paddingHorizontal: 20 }}>
            <Button label="Cerrar portada" onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}
