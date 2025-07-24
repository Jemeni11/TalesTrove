import type { BasicStoryAndAuthorType } from "~types";

export default function isQQDataArray(
  data: any[]
): data is BasicStoryAndAuthorType[] {
  return data.every(
    (item) =>
      typeof item.storyLink === "string" &&
      typeof item.storyName === "string" &&
      typeof item.authorName === "string" &&
      typeof item.authorLink === "string"
  );
}
