export type authorType = {
  name: string;
  link: string;
};

export type workObjectType = {
  id: string;
  title: string;
  link: string;
  authors: authorType[];
};

export type BasicStoryAndAuthorType = {
  storyLink: string;
  storyTitle: string;
  authorLink: string;
  authorName: string;
};

export type FFProcessedStoryData = BasicStoryAndAuthorType & {
  dateCreated: string;
  dateUpdated: string;
};

export type SubscriptionResult = {
  authors?: authorType[];
  works?: workObjectType[];
  series?: workObjectType[];
};

export type FFData = {
  storyData: {
    storyLink: string;
    storyTitle: string;
  };
  authorData: {
    authorLink: string;
    authorName: string;
  };
  dateCreated: string;
  dateUpdated: string;
};

export type sitesDataType = {
  fanfiction: {
    favorites: boolean;
    following: boolean;
  };
  archiveOfOurOwn: {
    work: boolean;
    series: boolean;
    author: boolean;
    username: string;
    alternateTLD: boolean;
  };
  questionableQuesting: {
    following: boolean;
  };
  spaceBattles: {
    following: boolean;
  };
  sufficientVelocity: {
    following: boolean;
  };
};

export type sitesDataTypeKey = keyof sitesDataType;

export type fileFormatType = {
  json: boolean;
  txt: boolean;
  csv: boolean;
  html: boolean;
  bookmarksHtml: boolean;
  linksOnly: boolean;
};

export type fileFormatTypeKey = keyof fileFormatType;

export type subDataParams = {
  [K in keyof sitesDataType]: K extends "archiveOfOurOwn"
    ? Exclude<keyof sitesDataType[K], "username">
    : keyof sitesDataType[K];
}[keyof sitesDataType];

export type expandedSectionsType = Record<sitesDataTypeKey, boolean>;

export type XenForoSites =
  | "QuestionableQuesting"
  | "SpaceBattles"
  | "SufficientVelocity";

export type XenForoSiteConfig = {
  [K in XenForoSites]: {
    name: `${K}Adapter`;
    baseUrl: string;
    watchedThreadsPath: string;
  };
};
