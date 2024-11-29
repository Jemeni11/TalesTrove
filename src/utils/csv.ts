import type {
  authorType,
  FFProcessedStoryData,
  QQDataType,
  workObjectType
} from "~types";

type CSVConvertible =
  | workObjectType
  | authorType
  | FFProcessedStoryData
  | QQDataType;

export function convertToCSV(data: workObjectType[] | authorType[] | FFProcessedStoryData[] | QQDataType[]): string {
  if (data.length === 0) {
    return "";
  }

  // Get headers dynamically from the keys of the first object
  const headers = Object.keys(data[0]).join(",");

  // Map over the data and convert each object to a CSV row
  const rows = data.map((obj) => {
    const values = Object.values(obj);
    const formattedValues = values.map((value) => {
      if (Array.isArray(value)) {
        // Join arrays with a delimiter (e.g., "|")
        return value.join("|");
      } else if (typeof value === "string") {
        // Escape commas in strings
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    return formattedValues.join(",");
  });

  // Combine headers and rows
  return `${headers}\n${rows.join("\n")}`;
}

export default function saveCSVFile(
  data: workObjectType[] | authorType[] | FFProcessedStoryData[] | QQDataType[],
  fileName: string
) {
  const csvData = convertToCSV(data);
  const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const csvUrl = URL.createObjectURL(csvBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = csvUrl;
  downloadLink.download = fileName;
  downloadLink.click();

  // Clean up the object URL after the file is downloaded
  setTimeout(() => {
    URL.revokeObjectURL(csvUrl);
  }, 100);
}
