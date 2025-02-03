import { parseHTML } from "linkedom";

import type { XenForoDataType } from "~types";
import { customError } from "~utils";

async function getSpaceBattlesData() {
  const adapterName = "SpaceBattlesAdapter";

  try {
    let SBThreadsURL =
      "https://forums.spacebattles.com/watched/threads?unread=0";

    const SBData: XenForoDataType[] = [];

    const createSBThreadsURL = (pageNumber: number) =>
      `https://forums.spacebattles.com/watched/threads?unread=0&page=${pageNumber}`;

    let numberOfPages = 1;
    let i = 1;

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    do {
      try {
        if (i > 1) {
          SBThreadsURL = createSBThreadsURL(i);
        }

        const response = await fetch(SBThreadsURL, {
          mode: "cors",
          credentials: "include",
          headers: {
            "User-Agent": navigator.userAgent
          }
        });

        if (response.status == 403 || response.status == 401) {
          customError(adapterName, "User isn't logged in");
        }

        const htmlText = await response.text();
        const { document } = parseHTML(htmlText);

        const threadsList = document.querySelector(
          "form[action='/watched/threads/update'] div.structItemContainer"
        )! as unknown as HTMLDivElement;

        if (!threadsList) {
          customError(adapterName, "There's no data for this site");
        }

        const liContentArray = Array.from(
          threadsList.children,
          (list) => list.children[1]
        ) as unknown as HTMLDivElement[];

        const urls = liContentArray.map((liContent) => {
          const mainBlock = liContent.querySelector(
            "div.structItem-title"
          ) as HTMLDivElement;

          const storyATag: HTMLAnchorElement =
            mainBlock.querySelector("a:not(.unreadLink)");

          let storyName = storyATag.textContent.trim();

          let storyLink = storyATag.getAttribute("href") || "";

          if (storyLink.endsWith("/unread")) {
            storyLink = storyLink.replace("/unread", "");
          }

          if (storyLink.startsWith("/threads")) {
            storyLink = "https://forums.spacebattles.com" + storyLink;
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
                authorLink = "https://forums.spacebattles.com" + authorLink;
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

        SBData.push(...urls);

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
        customError(adapterName, `Failed to fetch data from page ${i}`, error);
      } finally {
        i++;
      }
    } while (i <= numberOfPages);

    return SBData;
  } catch (error) {
    customError(adapterName, "An error occurred while fetching data", error);
  }
}

export default getSpaceBattlesData;
