import test from "node:test";
import assert from "node:assert/strict";
import { novelParagraphs, canShowOpening } from "../src/domain/novel-layout";
test("dialogue starts on a new line while narrator incises remain attached", () => {
  assert.deepEqual(
    novelParagraphs([
      "Me acerco a la puerta. —Hola —dice él—. ¿Puedo pasar? —Adelante —respondo.",
    ]),
    [
      "Me acerco a la puerta.",
      "—Hola —dice él—. ¿Puedo pasar?",
      "—Adelante —respondo.",
    ],
  );
});
test("existing dialogue lines and narrative breaks are preserved without empty blocks", () => {
  assert.deepEqual(novelParagraphs(["Una mañana.\n\n—Buenos días.\n- Hola."]), [
    "Una mañana.",
    "—Buenos días.",
    "—Hola.",
  ]);
});
test("narrator interruptions and ordinary hyphens are not treated as speaker changes", () => {
  const text =
    "—No lo sé —murmura—. Tal vez mañana. El tren Valencia-Madrid espera.";
  assert.deepEqual(novelParagraphs([text]), [text]);
});
test("opening is offered after cover is ready, without delaying generation or blocking on cover failure", () => {
  assert.equal(canShowOpening(true, undefined), false);
  assert.equal(canShowOpening(false, undefined), true);
  assert.equal(canShowOpening(true, "file://cover.png"), true);
  assert.equal(canShowOpening(true, undefined, "Image failed"), true);
});
