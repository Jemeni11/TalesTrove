import type { QQDataType } from "~types";

function cleanArray(array: QQDataType[]) {
  // Use a Map to keep track of unique names
  const uniqueNamesMap = new Map();

  // Filter the array based on unique names
  const uniqueArray = array.filter((obj) => {
    // Check if the name is already in the Map
    if (uniqueNamesMap.has(obj.storyLink)) {
      return false; // Duplicate found, exclude from the result
    }

    // Add the name to the Map to mark it as seen
    uniqueNamesMap.set(obj.storyLink, true);
    return true; // Include in the result
  });

  return uniqueArray;
}

async function getQuestionableQuestingData() {
  let QQThreadsURL =
    "https://forum.questionablequesting.com/watched/threads/all";

  const QQData: QQDataType[] = [];

  const createQQThreadsURL = (pageNumber: number) =>
    `https://forum.questionablequesting.com/watched/threads/all?page=${pageNumber}`;

  let numberOfPages = 1;
  let i = 1;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  do {
    try {
      if (i > 1) {
        QQThreadsURL = createQQThreadsURL(i);
      }

      const response = await fetch(QQThreadsURL, {
        mode: "cors",
        credentials: "include",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0"
        }
      });
      const htmlText = await response.text();

      const parser = new DOMParser();
      const document = parser.parseFromString(htmlText, "text/html");

      const threadsList: HTMLOListElement = document.querySelector(
        "form[action='watched/threads/update'] > ol.discussionListItems"
      )!;

      const liContentArray: HTMLDivElement[] = Array.from(
        threadsList.children,
        (list) => list.children[1]
      ) as unknown as HTMLDivElement[];

      const urls = liContentArray.map((liContent) => {
        const mainBlock = liContent.querySelector(
          "h3.title > a"
        ) as HTMLAnchorElement;
        const secondRow = liContent.querySelector(
          "a.username"
        ) as HTMLAnchorElement;

        return {
          storyLink: mainBlock["href"],
          storyName: mainBlock.textContent,
          authorLink: secondRow["href"],
          authorName: secondRow.textContent
        };
      });

      QQData.push(...urls);

      const pageNavLinkGroup: HTMLDivElement | null = document.querySelector(
        "div.pageNavLinkGroup"
      );

      if (pageNavLinkGroup) {
        const pageNumber = +pageNavLinkGroup
          .querySelector(".PageNav > .pageNavHeader")
          .textContent.split(" of ")
          .pop();

        numberOfPages = pageNumber;

        if (i < numberOfPages) {
          await delay(2000);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      i++;
    }
  } while (i <= numberOfPages);

  // This might be useless loll
  const cleanedQQData = cleanArray(QQData);

  return cleanedQQData;
}

export default getQuestionableQuestingData;
