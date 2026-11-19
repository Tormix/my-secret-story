function paragraphsStart(raw: string): number {
  let depth = 0;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === '"') {
      const start = i;
      let escaped = false,
        closed = false;
      for (i++; i < raw.length; i++) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (raw[i] === "\\") {
          escaped = true;
          continue;
        }
        if (raw[i] === '"') {
          closed = true;
          break;
        }
      }
      if (!closed) return -1;
      if (depth === 1) {
        let key: unknown;
        try {
          key = JSON.parse(raw.slice(start, i + 1));
        } catch {
          return -1;
        }
        if (key === "paragraphs") {
          const tail = /^\s*:\s*\[/.exec(raw.slice(i + 1));
          if (tail) return i + 1 + tail[0].length;
        }
      }
    } else if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") depth--;
  }
  return -1;
}
/** Offers only complete paragraph strings; never unfinished JSON or metadata. */
export class ParagraphStream {
  private raw = "";
  paragraphs: string[] = [];
  push(delta: string): string[] {
    this.raw += delta;
    if (this.raw.length > 300_000)
      throw new Error("Capítulo demasiado grande.");
    let i = paragraphsStart(this.raw);
    if (i < 0) return this.paragraphs;
    const completed: string[] = [];
    while (i < this.raw.length) {
      while (/[\s,]/.test(this.raw[i] || "x")) i++;
      if (this.raw[i] !== '"') break;
      const start = i++;
      let escaped = false,
        closed = false;
      for (; i < this.raw.length; i++) {
        const c = this.raw[i];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (c === "\\") {
          escaped = true;
          continue;
        }
        if (c === '"') {
          i++;
          closed = true;
          break;
        }
      }
      if (!closed) break;
      let value: unknown;
      try {
        value = JSON.parse(this.raw.slice(start, i));
      } catch {
        break;
      }
      if (typeof value !== "string" || !value.trim() || value.length > 5000)
        break;
      while (/\s/.test(this.raw[i] || "x")) i++;
      if (this.raw[i] !== "," && this.raw[i] !== "]") break;
      completed.push(value);
      if (this.raw[i] === "]") break;
    }
    if (completed.length > this.paragraphs.length) this.paragraphs = completed;
    return this.paragraphs;
  }
}
