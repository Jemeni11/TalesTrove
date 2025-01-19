import type {
  authorType,
  FFProcessedStoryData,
  workObjectType,
  XenForoDataType
} from "~types";

type BookmarkType =
  | workObjectType
  | XenForoDataType
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

  // Build bookmarks HTML directly as a string instead of using DOM manipulation
  const bookmarkItems = data
    .map((item) => {
      let url = "";
      let title = "";
      let dateAdded: string | undefined;

      if ("storyLink" in item && "storyName" in item) {
        url = item.storyLink;
        title = item.storyName ?? "Untitled";
      } else if ("storyLink" in item && "storyTitle" in item) {
        url = item.storyLink;
        title = item.storyTitle ?? "Untitled";
        dateAdded = item.dateCreated;
      } else if ("link" in item && "title" in item) {
        url = item.link;
        title = item.title ?? "Untitled";
      } else if ("link" in item && "name" in item) {
        url = item.link;
        title = item.name;
      } else {
        throw new Error("Unknown item type");
      }

      const dateAttribute = dateAdded
        ? ` add_date="${Math.floor(new Date(dateAdded).getTime() / 1000)}"`
        : "";

      return `
      <dt>
        <a href="${url}"${dateAttribute} target="_blank">${title}</a>
      </dt>`;
    })
    .join("\n");

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

  // Create a Blob for the HTML content
  const htmlBlob = new Blob([htmlContent], {
    type: "text/html;charset=utf-8;"
  });

  // Create a URL for the Blob
  const htmlUrl = URL.createObjectURL(htmlBlob);

  // Create an anchor element to trigger the download
  const downloadLink = document.createElement("a");
  downloadLink.href = htmlUrl;
  downloadLink.download = fileName;
  downloadLink.click();

  // Clean up the object URL after the file is downloaded
  setTimeout(() => {
    URL.revokeObjectURL(htmlUrl);
  }, 100);
}
