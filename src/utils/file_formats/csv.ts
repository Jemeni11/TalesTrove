import type {
  authorType,
  BasicStoryAndAuthorType,
  FFProcessedStoryData,
  workObjectType
} from "~types";

export function convertToCSV(
  data:
    | workObjectType[]
    | authorType[]
    | FFProcessedStoryData[]
    | BasicStoryAndAuthorType[]
): string {
  if (data.length === 0) {
    return "";
  }

  // Get a union of all keys from all items to ensure complete headers
  const headers = Array.from(new Set(data.flatMap((obj: {}) => Object.keys(obj))));

  // Join headers
  const headerRow = headers.join(",");

  // Build rows
  const rows = data.map((obj: { [x: string]: any; }) => {
    return headers
      .map((key) => {
        const value = obj[key];

        if (Array.isArray(value)) {
          return `"${value.join("|").replace(/"/g, '""')}"`;
        } else if (typeof value === "string") {
          return `"${value.replace(/"/g, '""')}"`;
        } else if (value == null) {
          return "";
        }
        return value;
      })
      .join(",");
  });

  return `${headerRow}\n${rows.join("\n")}`;
}

export default function saveCSVFile(
  data:
    | workObjectType[]
    | authorType[]
    | FFProcessedStoryData[]
    | BasicStoryAndAuthorType[],
  fileName: string
) {
  const csvData = convertToCSV(data);
  const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const csvUrl = URL.createObjectURL(csvBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = csvUrl;
  downloadLink.download = fileName;
  downloadLink.click();

  setTimeout(() => URL.revokeObjectURL(csvUrl), 100);
}
