import type {
  authorType,
  FFProcessedStoryData,
  fileFormatTypeKey,
  workObjectType,
  XenForoDataType
} from "~types";
import {
  saveBookmarkHTMLFile,
  saveCSVFile,
  saveHTMLFile,
  saveJSONFile,
  saveLinksOnlyTXTFile,
  saveTXTFile
} from "~utils";

export default function handleExport(
  data:
    | workObjectType[]
    | authorType[]
    | FFProcessedStoryData[]
    | XenForoDataType[],
  filePrefix: string,
  format: fileFormatTypeKey
) {
  switch (format) {
    case "csv":
      saveCSVFile(data, `${filePrefix}.csv`);
      break;
    case "json":
      saveJSONFile(data, `${filePrefix}.json`);
      break;
    case "html":
      saveHTMLFile(data, `${filePrefix}.html`);
      break;
    case "txt":
      saveTXTFile(data, `${filePrefix}.txt`);
      break;
    case "bookmarksHtml":
      saveBookmarkHTMLFile(data, `${filePrefix}_bookmarks.html`);
      break;
    case "linksOnly":
      saveLinksOnlyTXTFile(data, `${filePrefix}_linksOnly.txt`);
      break;
  }
}
