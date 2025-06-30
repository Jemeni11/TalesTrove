import type { authorType } from "~types";

export default function isAuthorArray(data: any[]): data is authorType[] {
  return data.every(
    (item) => typeof item.name === "string" && typeof item.link === "string"
  );
}
