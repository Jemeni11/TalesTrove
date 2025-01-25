import { atom, useSetAtom } from "jotai";

import type {
  fileFormatType,
  fileFormatTypeKey,
  sitesDataType,
  sitesDataTypeKey,
  subDataParams
} from "~types";

export const sitesData: sitesDataType = {
  fanfiction: {
    favorites: false,
    following: false
  },
  archiveOfOurOwn: {
    work: false,
    series: false,
    author: false,
    username: ""
  },
  questionableQuesting: {
    following: false
  },
  spaceBattles: {
    following: false
  },
  sufficientVelocity: {
    following: false
  }
};

export const fileFormat: fileFormatType = {
  json: false,
  txt: false,
  csv: false,
  html: false,
  bookmarksHtml: false,
  linksOnly: false
};

export const sitesDataAtom = atom(sitesData);
export const fileFormatAtom = atom(fileFormat);

export const useSetAO3Username = () => {
  const setSitesData = useSetAtom(sitesDataAtom);
  return (username: string) => {
    setSitesData((prev) => ({
      ...prev,
      archiveOfOurOwn: {
        ...prev.archiveOfOurOwn,
        username
      }
    }));
  };
};

export const useToggleFileFormat = () => {
  const setFileFormat = useSetAtom(fileFormatAtom);
  return (format: fileFormatTypeKey) => {
    setFileFormat((prev) => ({
      ...prev,
      [format]: !prev[format]
    }));
  };
};

export const useToggleSitesData = () => {
  const setSitesData = useSetAtom(sitesDataAtom);
  return (site: sitesDataTypeKey, subData: subDataParams) => {
    setSitesData((prev) => ({
      ...prev,
      [site]: {
        ...prev[site],
        [subData]: !prev[site][subData]
      }
    }));
  };
};

export const useResetAllOptions = () => {
  const setSitesData = useSetAtom(sitesDataAtom);
  const setFileFormat = useSetAtom(fileFormatAtom);
  return () => {
    setSitesData(sitesData);
    setFileFormat(fileFormat);
  };
};
