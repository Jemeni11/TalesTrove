import type {
  authorType,
  BasicStoryAndAuthorType,
  FFProcessedStoryData,
  workObjectType
} from "~types";
import {
  isAuthorArray,
  isFFProcessedStoryDataArray,
  isQQDataArray,
  isWorkObjectArray
} from "~utils/type_guards";

export default function saveLinksOnlyTXTFile(
  data:
    | BasicStoryAndAuthorType[]
    | FFProcessedStoryData[]
    | workObjectType[]
    | authorType[],
  fileName: string
) {
  if (data.length === 0) {
    console.error("No data to save.");
    return;
  }

  let content = "";

  // Process based on the type of data
  if (isFFProcessedStoryDataArray(data)) {
    content = data.map((item) => item.storyLink).join("\n");
  } else if (isQQDataArray(data)) {
    content = data.map((item) => item.storyLink).join("\n");
  } else if (isWorkObjectArray(data)) {
    content = data.map((item) => item.link).join("\n");
  } else if (isAuthorArray(data)) {
    content = data.map((item) => item.link).join("\n");
  } else {
    console.error("Unsupported data type.");
    return;
  }

  // Create the file
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
