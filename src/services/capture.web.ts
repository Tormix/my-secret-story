import { toPng } from "html-to-image";
import type { RefObject } from "react";
export async function captureCover(ref: RefObject<unknown>) {
  if (!ref.current) throw new Error("Cover not ready");
  return toPng(ref.current as HTMLElement, { pixelRatio: 3, cacheBust: false });
}
