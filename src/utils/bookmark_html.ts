import type {
  authorType,
  FFProcessedStoryData,
  QQDataType,
  workObjectType
} from "~types";

type BookmarkType =
  | workObjectType
  | QQDataType
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

  const htmlTemplate = `
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
        <dl id="bookmark-content"></dl>
    </body>
    </html>
  `;

  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const document = parser.parseFromString(htmlTemplate, "text/html");
  const dlElement = document.getElementById("bookmark-content");

  if (!dlElement) {
    console.error("Failed to create bookmark list.");
    return;
  }

  data.forEach((item) => {
    const dtElement = document.createElement("dt");
    const aElement = document.createElement("a");

    // Extract fields based on type
    let url = "";
    let title = "";
    let dateAdded: string | undefined;

    function isQQDataType(item: any): item is QQDataType {
      return "storyLink" in item && "storyName" in item;
    }

    function isFFProcessedStoryData(item: any): item is FFProcessedStoryData {
      return "storyLink" in item && "storyTitle" in item;
    }

    function isWorkObjectType(item: any): item is workObjectType {
      return (
        "link" in item &&
        "title" in item &&
        "authorName" in item &&
        "authorLink" in item
      );
    }

    function isAuthorType(item: any): item is authorType {
      return "name" in item && "link" in item;
    }

    if (isQQDataType(item)) {
      url = item.storyLink;
      title = item.storyName ?? "Untitled";
    } else if (isFFProcessedStoryData(item)) {
      url = item.storyLink;
      title = item.storyTitle ?? "Untitled";
      dateAdded = item.dateCreated;
    } else if (isWorkObjectType(item)) {
      url = item.link;
      title = item.title ?? "Untitled";
    } else if (isAuthorType(item)) {
      url = item.link;
      title = item.name;
    } else {
      throw new Error("Unknown item type");
    }

    aElement.href = url || "#";
    aElement.textContent = title || "Untitled";

    // Add date if available
    if (dateAdded) {
      const timestamp = Math.floor(new Date(dateAdded).getTime() / 1000);
      aElement.setAttribute("add_date", timestamp.toString());
    }

    aElement.target = "_blank";
    dtElement.appendChild(aElement);
    dlElement.appendChild(dtElement);
  });

  const htmlContent = serializer.serializeToString(document);
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
