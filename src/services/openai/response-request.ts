export function responseRequest(
  model: string,
  input: unknown[],
  instructions: string,
  json = true,
) {
  return {
    model,
    // JSON mode is validated against input messages, not the separate instructions.
    input: json
      ? [
          {
            role: "developer",
            content:
              "Return only valid JSON following the structure specified in the instructions.",
          },
          ...input,
        ]
      : input,
    instructions,
    store: false,
    stream: true,
    max_output_tokens: 9000,
    ...(/^gpt-[56]/.test(model) ? { reasoning: { effort: "low" } } : {}),
    ...(json ? { text: { format: { type: "json_object" } } } : {}),
  };
}
export function responseError(status: number, data: unknown, secret = "") {
  const error = (
    data as {
      error?: {
        code?: unknown;
        type?: unknown;
        param?: unknown;
        message?: unknown;
      };
    }
  )?.error;
  const redact = (value: unknown) => {
    let text = typeof value === "string" ? value : "";
    if (secret) text = text.split(secret).join("[clave oculta]");
    return text
      .replace(/sk-[A-Za-z0-9_-]{10,}/g, "[clave oculta]")
      .slice(0, 500);
  };
  const code = redact(error?.code || error?.type);
  const param = redact(error?.param);
  const detail = redact(error?.message);
  const hint =
    status === 400
      ? "La API ha rechazado un parámetro de la petición."
      : status === 401
        ? "Comprueba o restaura la clave en Ajustes."
        : status === 403
          ? "Comprueba el acceso del proyecto a este modelo."
          : status === 429
            ? "Comprueba el saldo y los límites de la API."
            : "Vuelve a intentarlo cuando el servicio esté disponible.";
  return `OpenAI HTTP ${status}${code ? ` · ${code}` : ""}${param ? ` · ${param}` : ""}. ${detail || hint} No se guardó un capítulo ni se cambió de modelo.`;
}
