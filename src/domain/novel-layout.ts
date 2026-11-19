/** Presentation-only Spanish novel typography. Keep narrator incises attached to dialogue. */
export function novelParagraphs(paragraphs: string[]): string[] {
  return paragraphs.flatMap((text) =>
    text
      .replace(/([.!?…][»”"]?)[\t ]+(?=—[\t ]*[A-ZÁÉÍÓÚÜÑ¿¡«“"])/gu, "$1\n")
      .split(/\r?\n+/)
      .map((line) => line.trim().replace(/^[-–][\t ]+(?=\S)/u, "—"))
      .filter(Boolean),
  );
}
export function canShowOpening(
  coverRequested?: boolean,
  cover?: string,
  coverError?: string,
) {
  return !coverRequested || Boolean(cover) || Boolean(coverError);
}
