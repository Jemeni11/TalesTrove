import type {
  authorType,
  FFProcessedStoryData,
  QQDataType,
  workObjectType
} from "~types";

export default function saveJSONFile(
  data: workObjectType[] | authorType[] | FFProcessedStoryData[] | QQDataType[],
  fileName: string
) {
  if (data.length === 0) {
    console.warn("No data to download.");
    return;
  }

  // Convert the data to a JSON string
  const jsonData = JSON.stringify(data, null, 2);

  // Create a blob for the JSON data
  const jsonBlob = new Blob([jsonData], {
    type: "application/json;charset=utf-8;"
  });

  // Create a URL for the blob
  const jsonUrl = URL.createObjectURL(jsonBlob);

  // Create an anchor element to trigger the download
  const downloadLink = document.createElement("a");
  downloadLink.href = jsonUrl;
  downloadLink.download = fileName;
  downloadLink.click();

  // Clean up the object URL after the file is downloaded
  setTimeout(() => {
    URL.revokeObjectURL(jsonUrl);
  }, 100);
}
