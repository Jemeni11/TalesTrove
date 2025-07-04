import { parseHTML } from "linkedom";

import { customError } from "~utils";

import type { authorType, SubscriptionResult, workObjectType } from "../types";

function cleanWorkArray(array: workObjectType[]): workObjectType[] {
  const uniqueNamesMap = new Map();

  return array.filter((obj) => {
    if (uniqueNamesMap.has(obj.link)) {
      return false;
    }

    uniqueNamesMap.set(obj.link, true);
    return true;
  });
}

function cleanAuthorArray(array: authorType[]): authorType[] {
  const uniqueNamesMap = new Map();

  return array.filter((obj) => {
    if (uniqueNamesMap.has(obj.link)) {
      return false;
    }

    uniqueNamesMap.set(obj.link, true);
    return true;
  });
}

async function getArchiveOfOurOwnData(
  username: string,
  alternateTLD: boolean,
  types?: ("author" | "work" | "series")[],
): Promise<SubscriptionResult> {
  const adapterName = "ArchiveOfOurOwnAdapter";

  if (username.trim() === "") {
    customError(adapterName, "No Username");
  }

  try {
    const tld = alternateTLD ? "gay" : "org"
    const baseURL = `https://archiveofourown.${tld}/users/${username}/subscriptions`;
    const typeQueryParam = types?.length === 1 ? `type=${types[0]}` : "";

    const createAO3SubscriptionURL = (pageNumber?: number) => {
      const pageQueryParam = pageNumber ? `page=${pageNumber}` : "";
      const queryParams = [pageQueryParam, typeQueryParam]
        .filter(Boolean)
        .join("&");
      return queryParams ? `${baseURL}?${queryParams}` : baseURL;
    };

    let ao3SubscriptionURL = createAO3SubscriptionURL();

    /**
   * 
    Examples 
    https://archiveofourown.org/users/stoleThunderNotLightning/subscriptions
    https://archiveofourown.org/users/stoleThunderNotLightning/subscriptions?page=2&type=works
    https://archiveofourown.org/users/stoleThunderNotLightning/subscriptions?page=6
    https://archiveofourown.org/users/stoleThunderNotLightning/subscriptions?page=5&type=users/
    https://archiveofourown.org/users/stoleThunderNotLightning/subscriptions?type=series
   */

    const authors: authorType[] = [];
    const works: workObjectType[] = [];
    const series: workObjectType[] = [];

    let numberOfPages = 1;
    let i = 1;

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    do {
      try {
        if (i > 1) {
          ao3SubscriptionURL = createAO3SubscriptionURL(i);
        }

        const response = await fetch(ao3SubscriptionURL, {
          mode: "cors",
          credentials: "include",
          headers: {
            "User-Agent": navigator.userAgent
          }
        });

        if (response.status == 302) {
          customError(adapterName, "User isn't logged in");
        }

        const htmlText = await response.text();
        const { document } = parseHTML(htmlText);

        if (
          document.querySelector(".flash.error")?.textContent ==
          "Sorry, you don't have permission to access the page you were trying to reach. Please log in."
        ) {
          customError(adapterName, "User isn't logged in");
        }

        const main: HTMLDivElement = document.querySelector("div#main")!;
        const dataLinkTable: HTMLDListElement = main.querySelector(
          "dl.subscription.index.group"
        )!;

        const links = Array.from(
          dataLinkTable.querySelectorAll("dt")!,
          (link) => {
            const children = link.children;
            return Array.from(children) as HTMLAnchorElement[];
          }
        );

        if (links.length == 0) {
          customError(adapterName, "There's no data for this site");
        }

        for (let linkArray of links) {
          const linkArrayLength = linkArray.length;

          if (linkArrayLength === 1) {
            const link = linkArray[0];
            const linkTextContent = link.textContent!.trim();

            if (link.href.includes("/users/")) {
              authors.push({
                name: linkTextContent,
                link: `https://archiveofourown.${tld}${link.href}`
              });
            } else {
              const isSeries = link.href.includes("/series/");

              const workLink = `https://archiveofourown.${tld}${link.href}`;
              const workTitle = linkTextContent;

              const workObject = {
                id: workLink,
                title: workTitle,
                link: workLink,
                authorName: ["Anonymous"],
                authorLink: [
                  `https://archiveofourown.${tld}/collections/anonymous`
                ]
              };

              if (isSeries) {
                series.push(workObject);
              } else {
                works.push(workObject);
              }
            }
          } else if (linkArrayLength >= 2) {
            const workAnchorTag = linkArray[0];
            const authorsAnchorTag = linkArray.slice(1);

            const workTitle = workAnchorTag.textContent!.trim();
            const isSeries = workAnchorTag.href.includes("/series/");

            const authorNames = authorsAnchorTag.map((author) =>
              author.textContent!.trim()
            );

            const authorLinks = authorsAnchorTag.map(
              (author) => `https://archiveofourown.${tld}${author.href}`
            );

            const workLink = `https://archiveofourown.${tld}${workAnchorTag.href}`

            const workObject = {
              id: workLink,
              title: workTitle,
              link: workLink,
              authorName: authorNames,
              authorLink: authorLinks
            };

            if (isSeries) {
              series.push(workObject);
            } else {
              works.push(workObject);
            }
          }
        }

        // Check if the subscriptions are on one page or more
        const nav: HTMLOListElement | null = main.querySelector(
          "ol[role='navigation']"
        );

        if (nav) {
          const navChildren = Array.from(
            nav.children,
            (listItem) => listItem.textContent!
          );
          numberOfPages = +navChildren[navChildren.length - 2];

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

    // Prepopulate the result with all data
    const result: SubscriptionResult = {
      authors: cleanAuthorArray(authors),
      works: cleanWorkArray(works),
      series: cleanWorkArray(series)
    };

    // Remove unwanted keys based on `types`
    if (types && types.length < 3) {
      if (!types.includes("author")) delete result.authors;
      if (!types.includes("work")) delete result.works;
      if (!types.includes("series")) delete result.series;
    }

    return result;
  } catch (error) {
    customError(adapterName, "An error occurred while fetching data", error);
  }
}

export default getArchiveOfOurOwnData;
