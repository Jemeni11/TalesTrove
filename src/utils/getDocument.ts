import { parseHTML } from "linkedom";

import customError from "./customError";

const getDocument = async (url: string, adapterName: string) => {
  const response = await fetch(url, {
    mode: "cors",
    credentials: "include",
    headers: { "User-Agent": navigator.userAgent }
  });

  if (response.status === 403 || response.status === 401) {
    customError(adapterName, "User isn't logged in");
  }

  const html = await response.text();
  return parseHTML(html).document;
};

export default getDocument;
