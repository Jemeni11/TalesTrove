import type {
  authorType,
  FFProcessedStoryData,
  QQDataType,
  workObjectType
} from "~types";
import {
  saveBookmarkHTMLFile,
  saveCSVFile,
  saveHTMLFile,
  saveJSONFile,
  saveTXTFile
} from "~utils";

export default function handleExport(
  data: workObjectType[] | authorType[] | FFProcessedStoryData[] | QQDataType[],
  filePrefix: string,
  format: string
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
  }
}
