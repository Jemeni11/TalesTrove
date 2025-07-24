import type {
  authorType,
  FFProcessedStoryData,
  workObjectType,
  BasicStoryAndAuthorType
} from "~types";

type HTMLConvertible =
  | workObjectType
  | authorType
  | FFProcessedStoryData
  | BasicStoryAndAuthorType;

export default function saveHTMLFile(
  data:
    | workObjectType[]
    | authorType[]
    | FFProcessedStoryData[]
    | BasicStoryAndAuthorType[],
  fileName: string
) {
  if (data.length === 0) {
    console.warn("No data to save.");
    return;
  }

  // Extract table headers from keys of the first object
  const headers = Object.keys(data[0]);

  // Generate table rows from data
  const rows = data.map((row) => {
    const cells = headers.map((header) => {
      const value = row[header];
      // Join array values with a delimiter for display
      const formattedValue = Array.isArray(value) ? value.join(", ") : value;
      return `<td style="white-space: nowrap; padding: 0.5rem 1rem; color: #374151;">${formattedValue}</td>`;
    });
    return `<tr style="border-bottom: 1px solid #E5E7EB;">${cells.join("")}</tr>`;
  });

  // Construct the HTML string
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Table</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 1rem; background-color: #F9FAFB;">
  <div style="overflow-x: auto;">
    <table style="min-width: 100%; border-collapse: collapse; background-color: #FFFFFF; font-size: 0.875rem;">
      <thead>
        <tr>
          ${headers
            .map(
              (header) =>
                `<th style="white-space: nowrap; padding: 0.5rem 1rem; font-weight: 500; color: #1F2937; text-align: left;">${String(header)}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.join("")}
      </tbody>
    </table>
  </div>
</body>
</html>`;

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
