import React, { useCallback, useState } from "react";
import {
  BackHandler,
  Image,
  Linking,
  Switch,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useStore } from "../../state/Store";
import {
  Button,
  Chip,
  colors,
  ErrorNotice,
  Eyebrow,
  Field,
  Page,
  Panel,
  Row,
  Title,
  Txt,
} from "../../components/ui";
import { CoverArt } from "../../components/CoverArt";
import { templates } from "../../data/templates";
import { createNovel, novelId } from "../../domain/engine";
import { readReaderCard } from "../../domain/reader-card";
import type { Profile, Intensity } from "../../domain/types";
import { pickLocalImage, takeLocalPhoto } from "../../services/media";
import { getApiKey } from "../../services/openai/credentials";
export default function CreateStory() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    { state, change } = useStore(),
    t = templates.find((x) => x.id === id),
    { width } = useWindowDimensions();
  const [step, setStep] = useState(0),
    [profile, setProfile] = useState<Profile>({
      ...state.profile,
      tone: state.profile.tone || "funny",
      protagonistMode: state.profile.protagonistMode || "fictional",
    }),
    [age, setAge] = useState(state.profile.age?.toString() || ""),
    [details, setDetails] = useState(false),
    [showImport, setShowImport] = useState(false),
    [raw, setRaw] = useState(""),
    [intensity, setIntensity] = useState<Intensity>("romantic"),
    [consent, setConsent] = useState(false),
    [photoConsent, setPhotoConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [photoBusy, setPhotoBusy] = useState(false),
    [error, setError] = useState("");
  const previousStep = useCallback(() => {
    if (step === 0) return false;
    if (!busy) {
      setError("");
      setStep(step - 1);
    }
    return true;
  }, [step, busy]);
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        previousStep,
      );
      return () => subscription.remove();
    }, [previousStep]),
  );
  if (!t)
    return (
      <Page back>
        <ErrorNotice message="Historia no encontrada." />
      </Page>
    );
  const template = t;
  const update = (key: keyof Profile, value: string) =>
    setProfile((p) => ({ ...p, [key]: value }));
  function next() {
    setError("");
    if (!profile.name.trim()) {
      setError("Escribe un nombre o seudónimo para tu personaje.");
      return;
    }
    if (age && (!/^\d+$/.test(age) || Number(age) < 18 || Number(age) > 120)) {
      setError(
        "La edad es opcional. Si la indicas, debe estar entre 18 y 120 años.",
      );
      return;
    }
    if (!consent) {
      setError(
        "Confirma que eres mayor de edad y autorizas enviar la ficha para crear la historia.",
      );
      return;
    }
    setStep(2);
  }
  async function photo(camera: boolean) {
    if (photoBusy) return;
    setPhotoBusy(true);
    setError("");
    try {
      const uri = await (camera ? takeLocalPhoto() : pickLocalImage());
      if (uri) {
        setProfile((p) => ({ ...p, photo: uri }));
        setPhotoConsent(false);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo abrir la foto. Puedes elegir la galería o seguir sin foto.",
      );
    } finally {
      setPhotoBusy(false);
    }
  }
  async function create() {
    if (busy || !consent) return;
    setError("");
    setBusy(true);
    try {
      const configured = Boolean(await getApiKey());
      const p = {
        ...profile,
        name: profile.name.trim(),
        age: age ? Number(age) : undefined,
      };
      const n = {
        ...createNovel(template.id, p, intensity, novelId()),
        source: "api" as const,
        generated: {},
        adventure: {
          templateId: template.id,
          totalChapters: 15 as const,
          occupation: p.occupation || "",
          loveInterestName: template.person,
          loveInterestRole: template.role,
          loveInterestDescription:
            template.heroCanon || "Persona adulta con motivaciones propias.",
          setting: template.setting,
          plot: template.hook,
          conflict: template.conflict,
          resolution: template.ending,
          goal: template.title,
          boundaries: p.boundaries || "",
          milestones: template.milestones,
        },
      };
      await change((s) => ({
        ...s,
        profile: p,
        novels: [
          ...s.novels,
          { ...n, coverRequested: Boolean(p.photo && photoConsent) },
        ],
        settings: {
          ...s.settings,
          model: s.settings.model || "gpt-6.1-sol",
          generationConsent: true,
        },
      }));
      router.replace({
        pathname: "/prepare/[id]",
        params: { id: n.id, auto: configured ? "1" : "0" },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  if (step === 0)
    return (
      <Page key="preview" back title="Descubre tu próxima historia">
        <View style={{ alignItems: "center", gap: 24 }}>
          <CoverArt universe={t.id} width={Math.min(width - 100, 270)} />
          <View style={{ alignSelf: "stretch", gap: 12 }}>
            <Eyebrow>{t.category}</Eyebrow>
            <Title style={{ fontSize: 35, lineHeight: 38 }}>{t.title}</Title>
            <Txt style={{ color: colors.rose, fontSize: 12 }}>
              Conoce a {t.person}
            </Txt>
            <Txt style={{ color: colors.muted, lineHeight: 25 }}>{t.hook}</Txt>
            <Txt style={{ color: colors.muted }}>15 capítulos · Tú eres la protagonista</Txt>
            <Button
              label="Elegir esta historia"
              icon="arrow-forward"
              onPress={() => {
                setStep(1);
                setError("");
              }}
            />
            <Txt
              style={{ fontSize: 11, textAlign: "center", color: colors.muted }}
            >
              Después eliges tu nombre. La foto es opcional.
            </Txt>
          </View>
        </View>
      </Page>
    );
  return (
    <Page key={step} back onBack={previousStep} title={t.title}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <CoverArt universe={t.id} width={58} />
        <View style={{ flex: 1, gap: 7 }}>
          <Eyebrow>
            {step === 1 ? "1 DE 2 · TU PERSONAJE" : "2 DE 2 · TU ESTILO"}
          </Eyebrow>
          <Txt style={{ fontSize: 12, color: colors.muted }}>{t.title}</Txt>
          <View style={{ height: 3, backgroundColor: colors.border }}>
            <View
              style={{
                height: 3,
                width: step === 1 ? "50%" : "100%",
                backgroundColor: colors.rose,
              }}
            />
          </View>
        </View>
      </View>
      {step === 1 ? (
        <>
          <Title style={{ fontSize: 39, lineHeight: 41 }}>
            ¿Cómo te llamas{"\n"}en esta historia?
          </Title>
          <Txt style={{ color: colors.muted, fontSize: 12 }}>
            Puedes ser tú o inventarte otra vida. Solo necesitamos un nombre.
          </Txt>
          <Field
            label="Tu nombre o seudónimo"
            value={profile.name}
            onChangeText={(v) => update("name", v)}
            placeholder="Por ejemplo, Laura"
            maxLength={40}
            autoCapitalize="words"
          />
          <Eyebrow>EN ESTA FICCIÓN QUIERO…</Eyebrow>
          <Row>
            <Chip
              label="Inventarme otra vida"
              selected={profile.protagonistMode === "fictional"}
              onPress={() => update("protagonistMode", "fictional")}
            />
            <Chip
              label="Conservar mis detalles"
              selected={profile.protagonistMode === "self"}
              onPress={() => update("protagonistMode", "self")}
            />
          </Row>
          <Button
            secondary
            label={
              details
                ? "Ocultar detalles opcionales"
                : "Añadir detalles · opcional"
            }
            icon={details ? "chevron-up" : "chevron-down"}
            onPress={() => setDetails(!details)}
          />
          {details ? (
            <Panel>
              <Field
                label="Edad (opcional, 18+)"
                value={age}
                onChangeText={setAge}
                maxLength={3}
                keyboardType="number-pad"
              />
              <Field
                label="Ciudad (opcional)"
                value={profile.city || ""}
                onChangeText={(v) => update("city", v)}
                maxLength={100}
              />
              <Field
                label="Profesión (opcional)"
                value={profile.occupation || ""}
                onChangeText={(v) => update("occupation", v)}
                maxLength={140}
              />
              <Field
                label="Cómo eres (opcional)"
                value={profile.traits}
                onChangeText={(v) => update("traits", v)}
                multiline
                maxLength={1000}
              />
              <Field
                label="Detalles de tu vida que quieres conservar"
                value={profile.lifeDetails || ""}
                onChangeText={(v) => update("lifeDetails", v)}
                multiline
                maxLength={2000}
              />
              <Field
                label="Qué te gustaría vivir"
                value={profile.wishes || ""}
                onChangeText={(v) => update("wishes", v)}
                maxLength={800}
              />
              <Field
                label="Qué prefieres que no aparezca"
                value={profile.boundaries || ""}
                onChangeText={(v) => update("boundaries", v)}
                maxLength={800}
              />
            </Panel>
          ) : null}
          <Button
            secondary
            label={
              showImport
                ? "Cerrar ficha para importar"
                : "Ya tengo una ficha · importar"
            }
            onPress={() => setShowImport(!showImport)}
          />
          {showImport ? (
            <Panel>
              <Field
                label="Pega tu ficha en texto o JSON"
                value={raw}
                onChangeText={setRaw}
                multiline
                maxLength={6000}
              />
              <Button
                label="Usar esta ficha"
                onPress={() => {
                  try {
                    const p = readReaderCard(raw, profile);
                    setProfile(p);
                    setAge(p.age?.toString() || "");
                    setShowImport(false);
                    setError("");
                  } catch (e) {
                    setError(
                      e instanceof Error
                        ? e.message
                        : "No se pudo leer la ficha.",
                    );
                  }
                }}
              />
            </Panel>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Switch
              accessibilityLabel="Soy mayor de edad y autorizo enviar mi ficha a OpenAI"
              value={consent}
              onValueChange={setConsent}
              trackColor={{ true: colors.wine }}
              thumbColor={consent ? colors.rose : undefined}
            />
            <Txt style={{ flex: 1, fontSize: 12, color: colors.muted }}>
              Tengo 18 años o más y autorizo enviar mi ficha a OpenAI para crear
              la historia.
            </Txt>
          </View>
          {error ? <ErrorNotice message={error} /> : null}
          <Button
            label="Siguiente: foto y estilo"
            icon="arrow-forward"
            onPress={next}
          />
        </>
      ) : (
        <>
          <Title style={{ fontSize: 39, lineHeight: 41 }}>Dale tu toque.</Title>
          <Txt style={{ fontSize: 12, color: colors.muted }}>
            La foto es opcional. Puedes empezar sin ella.
          </Txt>
          <Panel>
            <Eyebrow>TÚ EN LA PORTADA</Eyebrow>
            <Txt style={{ fontSize: 12, color: colors.muted }}>
              Hazte una foto o elige una donde se vea bien tu cara.
            </Txt>
            {profile.photo ? (
              <Image
                source={{ uri: profile.photo }}
                accessibilityLabel="Vista previa de tu foto"
                style={{
                  width: 160,
                  height: 190,
                  borderRadius: 16,
                  alignSelf: "center",
                }}
                resizeMode="cover"
              />
            ) : null}
            <Button
              secondary
              icon="camera-outline"
              label={profile.photo ? "Hacer otra foto" : "Hacerme una foto"}
              loading={photoBusy}
              disabled={busy}
              onPress={() => void photo(true)}
            />
            <Button
              secondary
              icon="images-outline"
              label="Elegir de la galería"
              disabled={busy || photoBusy}
              onPress={() => void photo(false)}
            />
            {profile.photo ? (
              <>
                <Button
                  secondary
                  label="Quitar foto"
                  onPress={() => {
                    setProfile((p) => ({ ...p, photo: undefined }));
                    setPhotoConsent(false);
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Switch
                    accessibilityLabel="Autorizo usar esta foto para crear mi portada"
                    value={photoConsent}
                    onValueChange={setPhotoConsent}
                    trackColor={{ true: colors.wine }}
                    thumbColor={photoConsent ? colors.rose : undefined}
                  />
                  <Txt style={{ flex: 1, fontSize: 11, color: colors.muted }}>
                    La foto es mía o tengo permiso, muestra a una persona adulta
                    y autorizo enviarla a OpenAI para crear mi portada. El
                    parecido puede variar.
                  </Txt>
                </View>
              </>
            ) : null}
          </Panel>
          <Eyebrow>¿QUÉ TONO TE APETECE?</Eyebrow>
          <Row>
            {(
              [
                ["funny", "Con humor"],
                ["tender", "Tierno"],
                ["dramatic", "Emocional"],
              ] as const
            ).map(([key, label]) => (
              <Chip
                key={key}
                label={label}
                selected={profile.tone === key}
                onPress={() => update("tone", key)}
              />
            ))}
          </Row>
          <Eyebrow>EL NIVEL DE INTIMIDAD LO ELIGES TÚ</Eyebrow>
          <Row>
            {(
              [
                ["romantic", "Romántico"],
                ["sensual", "Sensual"],
                ["intense", "Intenso"],
              ] as const
            ).map(([key, label]) => (
              <Chip
                key={key}
                label={label}
                selected={intensity === key}
                onPress={() => setIntensity(key)}
              />
            ))}
          </Row>
          {error ? (
            <>
              <ErrorNotice message={error} />
              {error.includes("ajustes de Android") ? (
                <Button
                  secondary
                  label="Abrir ajustes de la cámara"
                  onPress={() => void Linking.openSettings()}
                />
              ) : null}
            </>
          ) : null}
          <Button
            icon="sparkles-outline"
            label={
              profile.photo && photoConsent
                ? "Crear mi historia y mi portada"
                : "Empezar sin foto personalizada"
            }
            loading={busy}
            disabled={photoBusy}
            onPress={() => void create()}
          />
          <Button
            secondary
            label="Volver a mi personaje"
            disabled={busy}
            onPress={() => {
              setStep(1);
              setError("");
            }}
          />
          <Txt
            style={{ fontSize: 10, color: colors.muted, textAlign: "center" }}
          >
            Tu historia se escribe con IA y consume saldo de la API configurada.
            Puedes elegir el modelo en Ajustes.
          </Txt>
        </>
      )}
    </Page>
  );
}
