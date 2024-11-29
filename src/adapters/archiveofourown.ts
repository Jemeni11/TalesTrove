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
  type?: "authors" | "works" | "series"
): Promise<SubscriptionResult> {
  const baseURL = `https://archiveofourown.org/users/${username}/subscriptions`;
  const typeQueryParam = type ? `?type=${type}` : "";
  let ao3SubscriptionURL = `${baseURL}${typeQueryParam}`;

  const createAO3SubscriptionURL = (pageNumber: string) =>
    `${baseURL}${typeQueryParam}&page=${pageNumber}`;

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
        ao3SubscriptionURL = createAO3SubscriptionURL(i.toString());
      }

      const response = await fetch(ao3SubscriptionURL, {
        mode: "cors",
        credentials: "include",
        headers: {
          "User-Agent": navigator.userAgent
        }
      });

      const htmlText = await response.text();

      const parser = new DOMParser();
      const document = parser.parseFromString(htmlText, "text/html");

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

      for (let linkArray of links) {
        const linkArrayLength = linkArray.length;

        if (linkArrayLength === 1) {
          const link = linkArray[0];
          const linkTextContent = link
            .textContent!.replace(/\n\s+/g, " ")
            .trim();

          if (linkTextContent.includes("Anonymous")) {
            const isSeries = link.pathname.includes("/series/");

            const workLink = "https://archiveofourown.org" + link.pathname;
            const workTitle = link.textContent!.trim();

            const workObject = {
              id: workLink,
              title: workTitle,
              link: workLink,
              authorName: ["Anonymous"],
              authorLink: ["https://archiveofourown.org/collections/anonymous"]
            };

            if (isSeries) {
              series.push(workObject);
            } else {
              works.push(workObject);
            }
          } else {
            authors.push({
              name: link.textContent!.trim(),
              link: "https://archiveofourown.org" + link.pathname
            });
          }
        } else if (linkArrayLength >= 2) {
          const workAnchorTag = linkArray[0];
          const authorsAnchorTag = linkArray.slice(1);

          const workTitle = workAnchorTag.textContent!.trim();

          const isSeries = workAnchorTag.pathname.includes("/series/");

          const authorNames = authorsAnchorTag.map((author) =>
            author.textContent!.trim()
          );

          const authorLinks = authorsAnchorTag.map(
            (author) => "https://archiveofourown.org" + author.pathname
          );

          const workLink =
            "https://archiveofourown.org" + workAnchorTag.pathname;

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
      console.error(error);
    } finally {
      i++;
    }
  } while (i <= numberOfPages);

  // Return only the requested type, or all types if no type specified
  return {
    authors: type === "authors" ? cleanAuthorArray(authors) : undefined,
    works: type === "works" ? cleanWorkArray(works) : undefined,
    series: type === "series" ? cleanWorkArray(series) : undefined
  };
  // if (type === "authors") return { authors  };
  // if (type === "works") return { works };
  // if (type === "series") return { series };

  // return {
  //   authors: cleanArray(authors),
  //   works: cleanArray(works),
  //   series: cleanArray(series)
  // };
}

export default getArchiveOfOurOwnData;
