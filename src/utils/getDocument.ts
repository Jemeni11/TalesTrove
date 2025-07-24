import customError from "./customError";

const getDocument = async (
  url: string,
  adapterName: string,
  baseURL: string
) => {
  const response = await fetch(url, {
    mode: "cors",
    credentials: "include",
    headers: { "User-Agent": navigator.userAgent }
  });
  const html = await response.text();
  const document = new DOMParser().parseFromString(html, "text/html");

  if (response.status === 403 || response.status === 401) {
    const blockMessage = document
      .querySelector(".blockMessage")
      ?.textContent?.trim();

    if (blockMessage === "This user's profile is not available.") {
      customError({ name: adapterName, message: blockMessage });
    } else {
      customError({ name: adapterName, message: "User isn't logged in" });
    }
  }

  if (response.status == 302 && adapterName === "ArchiveOfOurOwnAdapter") {
    customError({ name: adapterName, message: "User isn't logged in" });
  }

  const baseTag = document.createElement("base");
  baseTag.href = baseURL;
  document.head.prepend(baseTag);

  return document;
};

export default getDocument;
