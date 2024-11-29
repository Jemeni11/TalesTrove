import type {
  authorType,
  FFProcessedStoryData,
  QQDataType,
  workObjectType
} from "~types";

export default function saveTXTFile(
  data: QQDataType[] | FFProcessedStoryData[] | workObjectType[] | authorType[],
  fileName: string
) {
  if (data.length === 0) {
    console.error("No data to save.");
    return;
  }

  let content = "";

  // Process based on the type of data
  if (isQQDataArray(data)) {
    content = data
      .map(
        (item) =>
          `Story Name: ${item.storyName}\nAuthor: ${item.authorName}\nLink: ${item.storyLink}\nAuthor Link: ${item.authorLink}\n`
      )
      .join("\n");
  } else if (isFFProcessedStoryDataArray(data)) {
    content = data
      .map(
        (item) =>
          `Story Title: ${item.storyTitle}\nAuthor: ${item.authorName}\nDate Created: ${item.dateCreated}\nDate Updated: ${item.dateUpdated}\nLink: ${item.storyLink}\nAuthor Link: ${item.authorLink}\n`
      )
      .join("\n");
  } else if (isWorkObjectArray(data)) {
    content = data
      .map(
        (item) =>
          `Title: ${item.title}\nAuthors: ${item.authorName.join(", ")}\nLink: ${item.link}\n`
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

// Type Guards for Array
function isQQDataArray(data: any[]): data is QQDataType[] {
  return data.every((item) => "storyLink" in item && "storyName" in item);
}

function isFFProcessedStoryDataArray(
  data: any[]
): data is FFProcessedStoryData[] {
  return data.every((item) => "storyTitle" in item && "dateCreated" in item);
}

function isWorkObjectArray(data: any[]): data is workObjectType[] {
  return data.every((item) => "title" in item && "authorName" in item);
}

function isAuthorArray(data: any[]): data is authorType[] {
  return data.every((item) => "name" in item && "link" in item);
}
