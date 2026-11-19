import React from "react";
import {
  Button,
  colors,
  Eyebrow,
  Page,
  Panel,
  Title,
  Txt,
  useCopy,
} from "../../components/ui";
import { useStore } from "../../state/Store";
export default function Plans() {
  const { state, change } = useStore(),
    t = useCopy();
  return (
    <Page>
      <Eyebrow>MY SECRET STORY PREMIUM</Eyebrow>
      <Title>{t("Quédate un capítulo más.", "Stay one more chapter.")}</Title>
      <Txt style={{ color: colors.muted }}>
        {t(
          "Simulación de monetización. No hay cobros ni compras reales. Las llamadas API se facturan en vuestro proyecto.",
          "Monetization simulation. No charges or real purchases. API usage is billed to your project.",
        )}
      </Txt>
      <Panel>
        <Eyebrow>{t("TU SALDO DE DEMOSTRACIÓN", "YOUR DEMO BALANCE")}</Eyebrow>
        <Title>{state.wallet.credits} ✧</Title>
        <Txt>
          {t(
            "Aventuras con API: tres capítulos de prueba y después Premium demo. Las historias offline antiguas usan créditos ficticios.",
            "API adventures: three trial chapters, then demo Premium. Legacy offline stories use fictional credits.",
          )}
        </Txt>
        <Button
          label={t(
            "Añadir 30 créditos demo · Gratis",
            "Add 30 demo credits · Free",
          )}
          onPress={() =>
            void change((s) => ({
              ...s,
              wallet: { ...s.wallet, credits: s.wallet.credits + 30 },
            }))
          }
        />
      </Panel>
      <Panel style={{ borderColor: colors.gold }}>
        <Eyebrow>
          {t("PREMIUM · SOLO DEMOSTRACIÓN", "PREMIUM · DEMONSTRATION ONLY")}
        </Eyebrow>
        <Title style={{ fontSize: 34, lineHeight: 38 }}>
          {t("Historias sin pausa", "Stories without pauses")}
        </Title>
        <Txt style={{ color: colors.muted }}>
          {t(
            "Desbloquea los capítulos de esta demo sin gastar créditos ficticios. No amplía tu plan Plus ni activa funciones de OpenAI.",
            "Unlock demo chapters without fictional credits. This does not expand your Plus plan or enable OpenAI features.",
          )}
        </Txt>
        <Button
          label={
            state.wallet.premium
              ? t("Desactivar Premium demo", "Disable demo Premium")
              : t("Activar Premium demo · Gratis", "Enable demo Premium · Free")
          }
          onPress={() =>
            void change((s) => ({
              ...s,
              wallet: { ...s.wallet, premium: !s.wallet.premium },
            }))
          }
        />
      </Panel>
    </Page>
  );
}
