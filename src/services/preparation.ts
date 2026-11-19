import type { Blueprint } from "../domain/adventure";
import type { GeneratedChapter } from "./chatgpt/protocol";
import type { Novel } from "../domain/types";
interface Preparation {
  cover?: {
    generate: () => Promise<string>;
    save: (uri: string) => Promise<void>;
    failed: (error: unknown) => void;
    settled: () => void;
  };
  text?: {
    blueprint: (novel: Novel) => Promise<Blueprint>;
    saveBlueprint: (plan: Blueprint) => Promise<void>;
    chapter: (novel: Novel) => Promise<GeneratedChapter>;
    saveChapter: (chapter: GeneratedChapter) => Promise<void>;
    phase: (phase: "outline" | "chapter") => void;
    failed: (error: unknown) => void;
    settled: () => void;
  };
}
export async function prepareAdventure(
  novel: Novel,
  jobs: Preparation,
  signal?: AbortSignal,
) {
  const active = () => {
    if (signal?.aborted) throw new Error("Generación cancelada.");
  };
  // Each asset is persisted and offered independently; neither waits for the other.
  const cover = async () => {
    if (!jobs.cover) return;
    try {
      active();
      const uri = await jobs.cover.generate();
      active();
      await jobs.cover.save(uri);
    } catch (e) {
      if (!signal?.aborted) jobs.cover.failed(e);
    } finally {
      jobs.cover.settled();
    }
  };
  const text = async () => {
    if (!jobs.text) return;
    try {
      active();
      let working = novel;
      if (!working.blueprint) {
        jobs.text.phase("outline");
        const plan = await jobs.text.blueprint(working);
        active();
        await jobs.text.saveBlueprint(plan);
        working = { ...working, blueprint: plan, memory: plan.memory };
      }
      jobs.text.phase("chapter");
      const chapter = await jobs.text.chapter(working);
      active();
      await jobs.text.saveChapter(chapter);
    } catch (e) {
      if (!signal?.aborted) jobs.text.failed(e);
    } finally {
      jobs.text.settled();
    }
  };
  await Promise.all([cover(), text()]);
}
