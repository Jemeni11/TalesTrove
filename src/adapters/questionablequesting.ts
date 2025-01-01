import { parseHTML } from "linkedom";

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
    "https://forum.questionablequesting.com/watched/threads?unread=0";

  const QQData: QQDataType[] = [];

  const createQQThreadsURL = (pageNumber: number) =>
    `https://forum.questionablequesting.com/watched/threads?unread=0&page=${pageNumber}`;

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
      const { document } = parseHTML(htmlText);

      const threadsList = document.querySelector(
        "form[action='/watched/threads/update'] div.structItemContainer"
      )! as unknown as HTMLDivElement;

      const liContentArray = Array.from(
        threadsList.children,
        (list) => list.children[1]
      ) as unknown as HTMLDivElement[];

      const urls = liContentArray.map((liContent) => {
        const mainBlock = liContent.querySelector(
          "div.structItem-title"
        ) as HTMLDivElement;

        const storyName = Array.from(mainBlock.children)
          .map((child) => child.textContent || "")
          .join(" ")
          .trim();

        let storyLink = mainBlock.lastElementChild.getAttribute("href") || "";

        if (storyLink.endsWith("/unread")) {
          storyLink = storyLink.replace("/unread", "");
        }

        if (storyLink.startsWith("/threads")) {
          storyLink = "https://forum.questionablequesting.com" + storyLink;
        }

        const secondRow = liContent.querySelector(
          "ul.structItem-parts > li:first-of-type > a, ul.structItem-parts > li:first-of-type > span"
        );

        let authorLink = "";
        let authorName = "";

        if (secondRow) {
          if (secondRow.tagName === "A") {
            const anchor = secondRow as HTMLAnchorElement;

            authorLink = anchor.getAttribute("href") || "";

            if (authorLink.startsWith("/members")) {
              authorLink =
                "https://forum.questionablequesting.com" + authorLink;
            }

            authorName = anchor.textContent || "";
          } else if (secondRow.tagName === "SPAN") {
            const span = secondRow as HTMLSpanElement;
            authorName = span.textContent || "";
            authorLink = "";
          }
        }

        return {
          storyLink,
          storyName,
          authorLink,
          authorName
        };
      });

      QQData.push(...urls);

      const pageNavWrapper = document.querySelector(
        "nav.pageNavWrapper"
      ) as HTMLElement | null;

      if (pageNavWrapper) {
        numberOfPages =
          +pageNavWrapper.querySelector("ul.pageNav-main").lastElementChild
            .textContent;

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
