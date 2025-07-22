import type {
  BasicStoryAndAuthorType,
  XenForoSiteConfig,
  XenForoSites
} from "~types";
import { customError, delay, getDocument } from "~utils";

async function getXenForoData(xenForoSite: XenForoSites) {
  const XENFORO_SITES: Record<XenForoSites, XenForoSiteConfig[XenForoSites]> = {
    QuestionableQuesting: {
      name: "QuestionableQuestingAdapter",
      baseUrl: "https://forum.questionablequesting.com",
      watchedThreadsPath: "/watched/threads"
    },
    SpaceBattles: {
      name: "SpaceBattlesAdapter",
      baseUrl: "https://forums.spacebattles.com",
      watchedThreadsPath: "/watched/threads"
    },
    SufficientVelocity: {
      name: "SufficientVelocityAdapter",
      baseUrl: "https://forums.sufficientvelocity.com",
      watchedThreadsPath: "/watched/threads"
    }
  };

  const config = XENFORO_SITES[xenForoSite];
  const adapterName = config.name;

  const data: BasicStoryAndAuthorType[] = [];

  try {
    const baseUrl = new URL(config.watchedThreadsPath, config.baseUrl);
    baseUrl.searchParams.set("unread", "0");

    const createThreadsURL = (pageNumber: number): URL => {
      const url = new URL(baseUrl);
      url.searchParams.set("page", pageNumber.toString());
      return url;
    };

    let numberOfPages = 1;
    let currentPage = 1;

    do {
      try {
        const requestUrl =
          currentPage > 1 ? createThreadsURL(currentPage) : baseUrl;

        const document = await getDocument(
          requestUrl.toString(),
          adapterName,
          baseUrl.toString()
        );

        const threadsList = document.querySelector(
          "form[action='/watched/threads/update'] div.structItemContainer"
        );

        if (!threadsList || !(threadsList instanceof HTMLDivElement)) {
          customError({
            name: adapterName,
            message: "There's no data for this site"
          });
        }

        const threadItems = Array.from(
          threadsList.children,
          (item) => item.children[1]
        ) as HTMLDivElement[];

        const pageData = threadItems.map((threadItem) => {
          const titleBlock = threadItem.querySelector(
            "div.structItem-title"
          ) as HTMLDivElement;

          const { storyTitle, storyLink } = extractStoryInfo(
            titleBlock,
            config.baseUrl
          );

          const { authorName, authorLink } = extractAuthorInfo(
            threadItem,
            config.baseUrl
          );

          return {
            storyLink,
            storyTitle,
            authorLink,
            authorName
          };
        });

        data.push(...pageData);

        // Handle pagination
        const pageNavWrapper = document.querySelector(
          "nav.pageNavWrapper"
        ) as HTMLElement | null;

        if (pageNavWrapper) {
          const lastPageElement =
            pageNavWrapper.querySelector("ul.pageNav-main")?.lastElementChild;

          const lastPageNumber = parseInt(
            lastPageElement?.textContent ?? "",
            10
          );

          if (!isNaN(lastPageNumber)) {
            numberOfPages = lastPageNumber;
          }

          if (currentPage < numberOfPages) {
            await delay(2000);
          }
        }
      } catch (error) {
        customError({
          name: adapterName,
          message: `Failed to fetch data from page ${currentPage}`,
          originalError: error,
          partial: data
        });
      } finally {
        currentPage++;
      }
    } while (currentPage <= numberOfPages);
  } catch (error) {
    customError({
      name: adapterName,
      message: "An error occurred while fetching data",
      originalError: error,
      partial: data
    });
  }
  return data;
}

export default getXenForoData;

function extractStoryInfo(titleBlock: HTMLDivElement, baseUrl: string) {
  // Handle different XenForo site structures
  const storyATag = titleBlock.querySelector(
    "a:not(.unreadLink)"
  ) as HTMLAnchorElement;

  let storyTitle: string;
  let storyLink: string;

  if (storyATag) {
    // SpaceBattles and SufficientVelocity style
    storyTitle = storyATag.textContent?.trim() || "";
    storyLink = storyATag.getAttribute("href") || "";
  } else {
    // QuestionableQuesting style - combine all children text
    storyTitle = Array.from(titleBlock.children)
      .map((child) => child.textContent || "")
      .join(" ")
      .trim();

    const lastChild = titleBlock.lastElementChild as HTMLAnchorElement;
    storyLink = lastChild?.getAttribute("href") || "";
  }

  // Clean up the link
  if (storyLink.endsWith("/unread")) {
    storyLink = storyLink.replace("/unread", "");
  }

  if (storyLink.startsWith("/threads")) {
    storyLink = new URL(storyLink, baseUrl).toString();
  }

  return { storyTitle, storyLink };
}

function extractAuthorInfo(threadItem: HTMLDivElement, baseUrl: string) {
  const authorElement = threadItem.querySelector(
    "ul.structItem-parts > li:first-of-type > a, ul.structItem-parts > li:first-of-type > span"
  );

  let authorLink = "";
  let authorName = "";

  if (authorElement) {
    if (authorElement.tagName === "A") {
      const anchor = authorElement as HTMLAnchorElement;

      authorLink = anchor.getAttribute("href") || "";
      if (authorLink.startsWith("/members")) {
        authorLink = new URL(authorLink, baseUrl).toString();
      }

      authorName = anchor.textContent || "";
    } else if (authorElement.tagName === "SPAN") {
      const span = authorElement as HTMLSpanElement;
      authorName = span.textContent || "";
      authorLink = "";
    }
  }

  return { authorName, authorLink };
}
