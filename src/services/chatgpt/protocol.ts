export const AUTH = "https://auth.openai.com/api/accounts";
export const RESOURCE = "https://api.openai.com/v1";
export const SCOPES =
  "openid profile email offline_access resource.invoke chatgpt.tokens.use.direct";
export interface Session {
  clientId: string;
  hostId: string;
  subject: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  idToken: string;
  expiresAt: number;
  scopes: string[];
}
export interface Model {
  slug: string;
  display_name: string;
  visibility?: string;
}
export interface Timing {
  startedAt: string;
  effort?: string;
  inputTokens?: number;
  outputTokens?: number;
  firstTokenMs?: number;
  totalMs: number;
  characters: number;
  model: string;
}
export interface GeneratedChapter {
  memory?: import("../../domain/adventure").Continuity;
  beatUpdates?: { chapter: number; aim: string }[];
  title: string;
  paragraphs: string[];
  summary: string;
  choices: { id: string; label: string; trust: number; courage: number }[];
  timing: Timing;
  lang: "es" | "en";
}
export function authUrl(p: {
  state: string;
  nonce: string;
  challenge: string;
  redirect: string;
  hostId: string;
  clientId?: string;
}) {
  const q = new URLSearchParams({
    client_id: p.clientId || "dynamic_agent_client",
    ext_agent_host_id: p.hostId,
    response_type: "code",
    redirect_uri: p.redirect,
    scope: SCOPES,
    resource: RESOURCE,
    state: p.state,
    nonce: p.nonce,
    code_challenge_method: "S256",
    code_challenge: p.challenge,
  });
  if (!p.clientId) q.set("agent_name_hint", "My Secret Story");
  return `${AUTH}/authorize?${q}`;
}
export function callback(url: string, expectedState: string, issued?: string) {
  const q = new URL(url).searchParams;
  if (q.get("state") !== expectedState) throw new Error("Invalid OAuth state");
  if (q.get("error"))
    throw new Error(
      q.get("error") === "access_denied"
        ? "Authorization declined"
        : `Authorization error: ${q.get("error")}`,
    );
  const id = q.get("client_id") || issued,
    code = q.get("code");
  if (
    !id ||
    id === "dynamic_agent_client" ||
    !code ||
    (issued && id !== issued)
  )
    throw new Error("Incomplete OAuth registration");
  return { clientId: id, code };
}
export function parseChapter(
  raw: string,
  chapter: number,
): Omit<GeneratedChapter, "timing" | "lang"> {
  const clean = raw
    .trim()
    .replace(/^```(?:json)?\s*/, "")
    .replace(/\s*```$/, "");
  const obj = JSON.parse(clean);
  if (
    typeof obj.title !== "string" ||
    typeof obj.summary !== "string" ||
    !Array.isArray(obj.paragraphs) ||
    obj.paragraphs.length < 5 ||
    obj.paragraphs.some((p: unknown) => typeof p !== "string" || !p.trim())
  )
    throw new Error("Invalid story format. Try again.");
  if (
    !Array.isArray(obj.choices) ||
    (chapter < 2 && obj.choices.length !== 2) ||
    (chapter === 2 && obj.choices.length !== 0)
  )
    throw new Error("Invalid chapter choices");
  return {
    title: obj.title,
    summary: obj.summary,
    paragraphs: obj.paragraphs,
    choices: obj.choices.map((c: { label: unknown }, i: number) => {
      if (typeof c.label !== "string" || !c.label)
        throw new Error("Invalid choice");
      return {
        id: `ai-${chapter}-${i}`,
        label: c.label,
        trust: i === 0 ? 2 : chapter === 0 ? 0 : -2,
        courage: i === 0 ? 0 : 2,
      };
    }),
  };
}
export class EventStream {
  private buffer = "";
  completed = false;
  response: Record<string, unknown> | undefined;
  text = "";
  constructor(private onText: (s: string) => void = () => {}) {}
  push(chunk: string) {
    this.buffer = (this.buffer + chunk).replace(/\r\n/g, "\n");
    let end: number;
    while ((end = this.buffer.indexOf("\n\n")) >= 0) {
      const block = this.buffer.slice(0, end);
      this.buffer = this.buffer.slice(end + 2);
      const data = block
        .split("\n")
        .filter((x) => x.startsWith("data:"))
        .map((x) => x.slice(5).trimStart())
        .join("\n");
      if (!data || data === "[DONE]") continue;
      const e = JSON.parse(data);
      if (e.type === "response.output_text.delta") {
        this.text += e.delta;
        this.onText(e.delta);
      }
      if (
        e.type === "response.failed" ||
        e.type === "response.incomplete" ||
        e.type === "error"
      )
        throw new Error(
          e.response?.error?.code || e.error?.code || e.code || e.type,
        );
      if (e.type === "response.completed") {
        this.completed = true;
        this.response = e.response;
      }
    }
  }
  finish() {
    if (!this.completed)
      throw new Error("Connection interrupted before response.completed");
    return this.text;
  }
}
