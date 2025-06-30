import type { FFProcessedStoryData } from "~types";

export default function isFFProcessedStoryDataArray(
  data: any[]
): data is FFProcessedStoryData[] {
  return data.every(
    (item) =>
      typeof item.storyLink === "string" &&
      typeof item.storyTitle === "string" &&
      typeof item.authorLink === "string" &&
      typeof item.authorName === "string" &&
      typeof item.dateCreated === "string" &&
      typeof item.dateUpdated === "string"
  );
}
