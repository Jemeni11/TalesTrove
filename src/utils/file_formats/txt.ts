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

export default function saveTXTFile(
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
    content = data
      .map(
        (item) =>
          `Story Title: ${item.storyTitle}\nAuthor: ${item.authorName}\nDate Created: ${item.dateCreated}\nDate Updated: ${item.dateUpdated}\nLink: ${item.storyLink}\nAuthor Link: ${item.authorLink}\n`
      )
      .join("\n");
  } else if (isQQDataArray(data)) {
    content = data
      .map(
        (item) =>
          `Story Name: ${item.storyTitle}\nAuthor: ${item.authorName}\nLink: ${item.storyLink}\nAuthor Link: ${item.authorLink}\n`
      )
      .join("\n");
  } else if (isWorkObjectArray(data)) {
    content = data
      .map(
        (item) =>
          `Title: ${item.title}\nAuthors: ${item.authors.map((a) => a.name).join(", ")}\nLink: ${item.link}\n`
      )
      .join("\n");
  } else if (isAuthorArray(data)) {
    content = data
      .map((item) => `Author: ${item.name}\nLink: ${item.link}\n`)
      .join("\n");
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
