export type NetworkStage = "preflight" | "token" | "identity" | "models";
export type FailureKind = "dns" | "timeout" | "tls" | "connection";
export class NetworkIssue extends Error {
  constructor(
    readonly stage: NetworkStage,
    readonly host: string,
    readonly kind: FailureKind,
  ) {
    super(`${host}: ${kind} (${stage})`);
    this.name = "NetworkIssue";
  }
}
export function failureKind(error: unknown): FailureKind {
  if (error instanceof NetworkIssue) return error.kind;
  const message = error instanceof Error ? error.message : String(error);
  if (
    /UnknownHost|Unable to resolve|name resolution|ENOTFOUND|EAI_AGAIN/i.test(
      message,
    )
  )
    return "dns";
  if (/SSL|TLS|certificate|CertPath/i.test(message)) return "tls";
  if (/timed?\s*out|timeout/i.test(message)) return "timeout";
  return "connection";
}
export function cancelled() {
  const error = new Error("Connection cancelled");
  error.name = "AbortError";
  return error;
}
/** Bound the entire operation, including body reading. Never replay OAuth POSTs. */
export async function networkOperation<T>(
  stage: NetworkStage,
  host: string,
  action: (signal: AbortSignal) => Promise<T>,
  signal?: AbortSignal,
  timeoutMs = 20000,
): Promise<T> {
  if (signal?.aborted) throw cancelled();
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  const stopped = new Promise<never>((_, reject) => {
    onAbort = () => {
      reject(cancelled());
      controller.abort();
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    timer = setTimeout(() => {
      reject(new NetworkIssue(stage, host, "timeout"));
      controller.abort();
    }, timeoutMs);
  });
  try {
    return await Promise.race([action(controller.signal), stopped]);
  } catch (error) {
    if (signal?.aborted) throw cancelled();
    if (error instanceof NetworkIssue) throw error;
    throw new NetworkIssue(stage, host, failureKind(error));
  } finally {
    if (timer) clearTimeout(timer);
    if (onAbort) signal?.removeEventListener("abort", onAbort);
  }
}
export function connectionMessage(error: unknown, lang: "es" | "en") {
  const es = lang === "es";
  if (error instanceof Error && error.name === "AbortError")
    return es ? "Conexión cancelada." : "Connection cancelled.";
  if (!(error instanceof NetworkIssue))
    return error instanceof Error ? error.message : String(error);
  const stage = {
    preflight: es ? "comprobar acceso" : "checking access",
    token: es ? "completar la sesión" : "completing sign-in",
    identity: es ? "verificar identidad" : "verifying identity",
    models: es ? "consultar modelos" : "loading models",
  }[error.stage];
  const reason = {
    dns: es
      ? "Android no puede resolver la dirección del servidor (DNS)."
      : "Android cannot resolve the server address (DNS).",
    timeout: es
      ? "El servidor no respondió a tiempo."
      : "The server did not respond in time.",
    tls: es
      ? "No se pudo validar la conexión segura. Revisa la fecha y hora del móvil y cualquier filtro de red."
      : "The secure connection could not be verified. Check device date/time and network filters.",
    connection: es
      ? "No se pudo establecer la conexión de red."
      : "The network connection could not be established.",
  }[error.kind];
  return `${es ? "Fallo al" : "Failed while"} ${stage}: ${error.host}. ${reason} ${es ? "Usa «Comprobar acceso a OpenAI» para obtener el diagnóstico." : "Use “Check access to OpenAI” for diagnostics."}`;
}
