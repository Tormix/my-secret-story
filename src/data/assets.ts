import type { Universe } from "../domain/types";
const baseArt: Record<
  "detective" | "firefighter" | "lawyer" | "crossfit" | "chef",
  { cover: number; character: number; scene1: number; scene2: number }
> = {
  detective: {
    cover: require("../../assets/stories/detective-cover.jpg"),
    character: require("../../assets/stories/detective-character.jpg"),
    scene1: require("../../assets/stories/detective-scene1.jpg"),
    scene2: require("../../assets/stories/detective-scene2.jpg"),
  },
  firefighter: {
    cover: require("../../assets/stories/firefighter-cover.jpg"),
    character: require("../../assets/stories/firefighter-character.jpg"),
    scene1: require("../../assets/stories/firefighter-scene1.jpg"),
    scene2: require("../../assets/stories/firefighter-scene2.jpg"),
  },
  lawyer: {
    cover: require("../../assets/stories/lawyer-cover.jpg"),
    character: require("../../assets/stories/lawyer-character.jpg"),
    scene1: require("../../assets/stories/lawyer-scene1.jpg"),
    scene2: require("../../assets/stories/lawyer-scene2.jpg"),
  },
  crossfit: {
    cover: require("../../assets/stories/crossfit-cover.jpg"),
    character: require("../../assets/stories/crossfit-character.jpg"),
    scene1: require("../../assets/stories/crossfit-scene1.jpg"),
    scene2: require("../../assets/stories/crossfit-scene2.jpg"),
  },
  chef: {
    cover: require("../../assets/stories/chef-cover.jpg"),
    character: require("../../assets/stories/chef-character.jpg"),
    scene1: require("../../assets/stories/chef-scene1.jpg"),
    scene2: require("../../assets/stories/chef-scene2.jpg"),
  },
};

// Imágenes locales de ambientación del prototipo previo. Se sustituyen por API desde Ajustes.
export const art: Record<
  Universe,
  { cover: number; character: number; scene1: number; scene2: number }
> = {
  ...baseArt,
  actor: baseArt.detective,
  business: baseArt.lawyer,
  reunion: baseArt.lawyer,
  nile: {
    ...baseArt.detective,
    cover: require("../../assets/stories/detective-scene2.jpg"),
  },
  highlands: {
    ...baseArt.firefighter,
    cover: require("../../assets/stories/firefighter-scene2.jpg"),
  },
  neighbor: {
    ...baseArt.chef,
    cover: require("../../assets/stories/chef-character.jpg"),
  },
  vineyard: {
    ...baseArt.chef,
    cover: require("../../assets/stories/chef-scene2.jpg"),
  },
  train: {
    ...baseArt.lawyer,
    cover: require("../../assets/stories/lawyer-scene2.jpg"),
  },
};
