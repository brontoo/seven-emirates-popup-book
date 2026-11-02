import AbuDhabiChapter from "./AbuDhabiChapter";
import DubaiChapter from "../chapters/dubai/DubaiChapter";
import { chapters } from "../data/chapters";
export const chapterRegistry = {
  "abu-dhabi": AbuDhabiChapter,
  dubai: DubaiChapter,
};
export default function ChapterSpread({ chapter, ...props }) {
  const Chapter = chapterRegistry[chapters[chapter].id];
  return Chapter ? <Chapter {...props} /> : null;
}
