import React, { useEffect, useRef, useState } from "react";
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
  ask,
} from "../../components/ui";
import {
  getApiKey,
  setApiKey,
  hasEmbeddedKey,
  restoreEmbeddedKey,
} from "../../services/openai/credentials";
import { listModels, testConnection } from "../../services/chatgpt/client";
import type { Model, Timing } from "../../services/chatgpt/protocol";
import { generateImage, coverPrompt } from "../../services/openai/images";
import { templates } from "../../data/templates";
import { StoryWaiting } from "../../components/StoryWaiting";
import { exportPersonalData } from "../../services/media";
export default function Settings() {
  const { state, change } = useStore(),
    [configured, setConfigured] = useState(false),
    [previewWaiting, setPreviewWaiting] = useState(false),
    [key, setKey] = useState(""),
    [models, setModels] = useState<Model[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [phase, setPhase] = useState(""),
    [timing, setTiming] = useState<Timing>(),
    controller = useRef<AbortController | null>(null);
  useEffect(() => {
    void getApiKey().then((k) => setConfigured(Boolean(k)));
    return () => controller.current?.abort();
  }, []);
  async function run(fn: () => Promise<void>) {
    if (controller.current) return;
    setBusy(true);
    setError("");
    setMessage("");
    controller.current = new AbortController();
    try {
      await fn();
    } catch (e) {
      setError(
        controller.current?.signal.aborted
          ? "Operación cancelada. Conservamos lo terminado."
          : e instanceof Error
            ? e.message
            : String(e),
      );
    } finally {
      setBusy(false);
      setPhase("");
      controller.current = null;
    }
  }
  async function catalogCovers() {
    const missing = templates.filter(
      (t) => !state.settings.catalogCovers?.[t.id],
    );
    if (!missing.length) {
      setMessage("Las diez portadas ya están guardadas.");
      return;
    }
    for (let i = 0; i < missing.length; i++) {
      if (controller.current?.signal.aborted) break;
      const t = missing[i];
      setPhase(`Creando portada ${i + 1} de ${missing.length} · ${t.title}`);
      const uri = await generateImage(
        coverPrompt(t),
        controller.current?.signal,
      );
      if (controller.current?.signal.aborted) break;
      await change((s) => ({
        ...s,
        settings: {
          ...s.settings,
          catalogCovers: { ...s.settings.catalogCovers, [t.id]: uri },
        },
      }));
    }
    if (!controller.current?.signal.aborted)
      setMessage("Portadas terminadas y guardadas en este móvil.");
  }
  return (
    <Page>
      <Eyebrow>EL LABORATORIO DE TU HISTORIA</Eyebrow>
      <Title>Ajustes</Title>
      <Panel style={{ borderColor: colors.gold }}>
        <Eyebrow>CONEXIÓN API OPENAI</Eyebrow>
        <Title style={{ fontSize: 30, lineHeight: 34 }}>
          {configured
            ? "API lista para crear."
            : "Conecta el motor de tus historias."}
        </Title>
        <Txt style={{ color: colors.muted, fontSize: 12 }}>
          {hasEmbeddedKey
            ? "Esta compilación incorpora una clave dedicada a pruebas. Puede extraerse del APK; distribúyela solo entre los socios."
            : "Esta compilación no contiene una clave. Puedes configurarla aquí, en el almacén seguro de Android, o incrustarla al compilar una versión privada."}
        </Txt>
        <Txt style={{ color: configured ? colors.rose : colors.gold }}>
          {configured
            ? "● Clave configurada en este dispositivo"
            : "○ Pendiente de clave API"}
        </Txt>
        {hasEmbeddedKey ? (
          <Button
            secondary
            label="Usar la clave integrada de la demo"
            disabled={busy}
            onPress={() =>
              void run(async () => {
                await restoreEmbeddedKey();
                setConfigured(true);
                setModels([]);
                setMessage(
                  "Clave integrada activada. Ya puedes crear tu historia.",
                );
              })
            }
          />
        ) : null}
        <Field
          label="Configurar o sustituir clave API"
          value={key}
          onChangeText={setKey}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="sk-… (nunca se exporta con tus datos)"
        />
        <Button
          label="Guardar clave en este móvil"
          disabled={!key.trim()}
          loading={busy}
          onPress={() =>
            void run(async () => {
              await setApiKey(key);
              setKey("");
              setConfigured(true);
              setMessage(
                "Clave guardada. Consulta modelos y prueba la conexión.",
              );
            })
          }
        />
        {configured ? (
          <Button
            secondary
            label="Desactivar clave en este móvil"
            disabled={busy}
            onPress={() =>
              ask(
                "Desactivar clave",
                "La app dejará de enviar peticiones hasta que configures una clave de nuevo. Esto no revoca la clave en OpenAI.",
                () =>
                  void run(async () => {
                    await setApiKey("");
                    setConfigured(false);
                    setModels([]);
                  }),
              )
            }
          />
        ) : null}
      </Panel>
      <Panel>
        <Eyebrow>MODELO PARA LOS CAPÍTULOS</Eyebrow>
        <Title style={{ fontSize: 29, lineHeight: 32 }}>Prueba otra voz.</Title>
        <Txt style={{ fontSize: 12, color: colors.muted }}>
          Inicial: GPT-6.1 Sol · esfuerzo bajo (low). El catálogo procede de la
          API de vuestro proyecto, que puede diferir del selector de la
          suscripción ChatGPT.
        </Txt>
        <Txt style={{ fontSize: 12, color: colors.rose }}>
          Seleccionado: {state.settings.model || "gpt-6.1-sol"}
        </Txt>
        <Button
          secondary
          label="Consultar modelos disponibles"
          disabled={!configured}
          loading={busy}
          onPress={() =>
            void run(async () => {
              const available = await listModels();
              setModels(available);
              setMessage(
                available.length
                  ? "Elige uno de los modelos devueltos por OpenAI."
                  : "La API no devolvió modelos de texto compatibles para este selector.",
              );
            })
          }
        />
        <Row>
          {models.map((m) => (
            <Chip
              key={m.slug}
              label={m.display_name}
              selected={m.slug === state.settings.model}
              onPress={() =>
                void change((s) => ({
                  ...s,
                  settings: { ...s.settings, model: m.slug },
                }))
              }
            />
          ))}
        </Row>
        <Button
          label="Probar modelo y medir una frase"
          disabled={!configured}
          loading={busy}
          onPress={() =>
            void run(async () => {
              setPhase("Escribiendo una bienvenida con el modelo elegido…");
              let text = "";
              const r = await testConnection(
                state.settings.model || "gpt-6.1-sol",
                (d) => {
                  text += d;
                },
                controller.current?.signal,
              );
              setMessage(text);
              setTiming(r.timing);
            })
          }
        />
        {timing ? (
          <Txt style={{ color: colors.gold, fontSize: 11 }}>
            {timing.model} · primer texto{" "}
            {((timing.firstTokenMs || 0) / 1000).toFixed(2)} s · total{" "}
            {(timing.totalMs / 1000).toFixed(2)} s · salida{" "}
            {timing.outputTokens ?? "—"} tokens
          </Txt>
        ) : null}
      </Panel>
      <Panel>
        <Eyebrow>LA ESPERA TAMBIÉN FORMA PARTE</Eyebrow>
        <Button
          secondary
          label={
            previewWaiting
              ? "Cerrar vista previa de espera"
              : "Ver animación de espera (sin API)"
          }
          onPress={() => setPreviewWaiting((v) => !v)}
        />
        {previewWaiting ? (
          <StoryWaiting phase="Vista previa · sin peticiones API" />
        ) : null}
      </Panel>
      <Panel>
        <Eyebrow>LAS DIEZ PORTADAS</Eyebrow>
        <Title style={{ fontSize: 29, lineHeight: 32 }}>
          Dales su propia imagen.
        </Title>
        <Txt style={{ fontSize: 12, color: colors.muted }}>
          El catálogo incluye diez portadas generadas con IA. Este botón crea
          las portadas de las diez aventuras mediante la API de imágenes y
          conserva cada una al terminar. Solo solicita las que falten; cancelar
          no borra las ya terminadas.
        </Txt>
        <Txt style={{ fontSize: 11, color: colors.gold }}>
          Guardadas: {Object.keys(state.settings.catalogCovers || {}).length} de
          10 · modelo de imagen: GPT Image 2 · calidad baja para pruebas. Se
          factura en vuestro proyecto API.
        </Txt>
        <Button
          label="Generar las portadas que faltan"
          disabled={
            !configured ||
            Object.keys(state.settings.catalogCovers || {}).length === 10
          }
          loading={busy}
          onPress={() => void run(catalogCovers)}
        />
      </Panel>
      {busy ? (
        <Panel>
          <StoryWaiting phase={phase || "Preparando la conexión…"} />
          <Button
            secondary
            label="Cancelar"
            onPress={() => controller.current?.abort()}
          />
        </Panel>
      ) : null}
      {error ? <ErrorNotice message={error} /> : null}
      {message ? (
        <Panel>
          <Txt selectable>{message}</Txt>
        </Panel>
      ) : null}
      <Panel>
        <Eyebrow>LECTURA Y PRIVACIDAD</Eyebrow>
        <Row>
          <Chip
            label="Lector oscuro"
            selected={state.settings.darkReader}
            onPress={() =>
              void change((s) => ({
                ...s,
                settings: { ...s.settings, darkReader: !s.settings.darkReader },
              }))
            }
          />
          <Chip
            label="Español"
            selected={state.settings.lang === "es"}
            onPress={() =>
              void change((s) => ({
                ...s,
                settings: { ...s.settings, lang: "es" },
              }))
            }
          />
          <Chip
            label="English (lectura)"
            selected={state.settings.lang === "en"}
            onPress={() =>
              void change((s) => ({
                ...s,
                settings: { ...s.settings, lang: "en" },
              }))
            }
          />
        </Row>
        <Txt style={{ fontSize: 12, color: colors.muted }}>
          Tus fichas, capítulos y elecciones se guardan en este dispositivo.
          Generar envía el contexto necesario a OpenAI. Las imágenes usan
          descripciones. Tu foto solo se adjunta al crear una portada con foto y
          autorizar su envío. No hay sincronización, servidor comercial ni pagos
          reales. Una clave incrustada es extraíble; usa una dedicada y revócala
          al terminar las pruebas.
        </Txt>
        <Button
          secondary
          label="Exportar mis historias y fichas (JSON)"
          onPress={() => void run(() => exportPersonalData(state))}
        />
      </Panel>
      <Txt style={{ fontSize: 11, color: colors.muted }}>
        My Secret Story · Android 1.4.0 · demo API para adultos
      </Txt>
    </Page>
  );
}
