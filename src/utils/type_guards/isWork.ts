import type { workObjectType } from "~types";

export default function isWorkObjectArray(
  data: any[]
): data is workObjectType[] {
  return data.every(
    (item) =>
      typeof item.title === "string" &&
      typeof item.link === "string" &&
      Array.isArray(item.authors) &&
      item.authors.every(
        (author: { name: any; link: any }) =>
          typeof author.name === "string" && typeof author.link === "string"
      )
  );
}
