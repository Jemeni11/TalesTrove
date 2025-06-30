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

type BookmarkType =
  | workObjectType
  | BasicStoryAndAuthorType
  | FFProcessedStoryData
  | authorType;

export default function saveBookmarkHTMLFile(
  data: BookmarkType[],
  fileName: string
) {
  if (data.length === 0) {
    console.warn("No bookmarks to save.");
    return;
  }

  let bookmarkItems = "";

  if (isQQDataArray(data)) {
    bookmarkItems = data
      .map(
        (item) => `
        <dt><a href="${item.storyLink}" target="_blank">${item.storyTitle}</a></dt>`
      )
      .join("\n");
  } else if (isFFProcessedStoryDataArray(data)) {
    bookmarkItems = data
      .map(
        (item) => `
        <dt><a href="${item.storyLink}" add_date="${Math.floor(
          new Date(item.dateCreated).getTime() / 1000
        )}" target="_blank">${item.storyTitle}</a></dt>`
      )
      .join("\n");
  } else if (isWorkObjectArray(data)) {
    bookmarkItems = data
      .map(
        (item) => `
        <dt><a href="${item.link}" target="_blank">${item.title}</a></dt>`
      )
      .join("\n");
  } else if (isAuthorArray(data)) {
    bookmarkItems = data
      .map(
        (item) => `
        <dt><a href="${item.link}" target="_blank">${item.name}</a></dt>`
      )
      .join("\n");
  } else {
    console.error("Unsupported data type for bookmark export.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE NETSCAPE-Bookmark-file-1>
    <!-- This is an automatically generated file.
        It will be read and overwritten.
        DO NOT EDIT! -->
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Bookmarks</title>
    </head>
    <body>
        <h1>Bookmarks</h1>
        <dl>
            ${bookmarkItems}
        </dl>
    </body>
    </html>
  `;

  const htmlBlob = new Blob([htmlContent], {
    type: "text/html;charset=utf-8;"
  });

  const htmlUrl = URL.createObjectURL(htmlBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = htmlUrl;
  downloadLink.download = fileName;
  downloadLink.click();

  setTimeout(() => {
    URL.revokeObjectURL(htmlUrl);
  }, 100);
}
