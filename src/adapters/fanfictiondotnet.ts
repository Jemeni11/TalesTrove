import type { FFData, FFProcessedStoryData } from "~types";

const FFFavoritesMobileURL = "https://m.fanfiction.net/m/f_story.php";

const FFFollowingMobileURL = "https://m.fanfiction.net/m/a_story.php";

function processStoryData(data: FFData): FFProcessedStoryData {
  const { authorData, storyData, dateCreated, dateUpdated } = data;

  const authorLink = "https://www.fanfiction.net" + authorData.authorLink;
  const authorName = authorData.authorName;
  const storyLink = "https://www.fanfiction.net" + storyData.storyLink;
  const storyTitle = storyData.storyTitle;

  // Modify dateCreated and dateUpdated as needed
  // Convert the date to a reasonable format: yyyy-mm-dd instead of mm-dd-yyyy
  const dateCreatedArray = `${dateCreated}`.substring(2).split("-");
  const dateUpdatedArray = `${dateUpdated}`.substring(1).split("-");
  const modifiedDateCreated = `${dateCreatedArray[2]}-${dateCreatedArray[0]}-${dateCreatedArray[1]}`;
  const modifiedDateUpdated = `${dateUpdatedArray[2]}-${dateUpdatedArray[0]}-${dateUpdatedArray[1]}`;

  return {
    authorLink,
    authorName,
    storyLink,
    storyTitle,
    dateCreated: modifiedDateCreated,
    dateUpdated: modifiedDateUpdated
  };
}

async function getFanFictionNetStoryData(
  url: string
): Promise<FFProcessedStoryData[]> {
  try {
    const response = await fetch(url, {
      mode: "cors",
      credentials: "include"
    });
    const htmlText = await response.text();

    const parser = new DOMParser();
    const document = parser.parseFromString(htmlText, "text/html");

    const tableRows = Array.from(
      document.querySelectorAll("table tbody")[0].children,
      (tableRow) => tableRow.children
    );
    tableRows.pop(); // Removes the "Remove Selected" button
    tableRows.shift(); // Removes the header row

    const tableRowsHTMLCollection = tableRows.map((row) => row[0].children);

    const storyDataList = tableRowsHTMLCollection.map((row) => {
      const rowCells = Array.from(row);
      const rowCellsHTML = rowCells as HTMLElement[];
      rowCellsHTML.splice(2, 1);
      rowCellsHTML.splice(3, 1);
      return rowCellsHTML;
    });

    const actualData = storyDataList.map((rowCells) => {
      return rowCells.map((cell) => {
        if (cell.tagName === "A") {
          const anchor = cell as HTMLAnchorElement;
          return [anchor.pathname, anchor.textContent];
        }
        return cell.textContent;
      });
    });

    const processedStoryDataList = actualData.map((data) => {
      const fanFictionData: FFData = {
        storyData: {
          storyLink: data[0]![0]!,
          storyTitle: data[0]![1]!
        },
        authorData: {
          authorLink: data[1]![0]!,
          authorName: data[1]![1]!
        },
        dateCreated: data![2] as string,
        dateUpdated: data![3] as string
      };
      return processStoryData(fanFictionData);
    });

    return processedStoryDataList;
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    return [];
  }
}

export async function getFFFollowingData() {
  return await getFanFictionNetStoryData(FFFollowingMobileURL);
}

export async function getFFFavoritesData() {
  return await getFanFictionNetStoryData(FFFavoritesMobileURL);
}
