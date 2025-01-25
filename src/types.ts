export type workObjectType = {
  id: string;
  title: string;
  link: string;
  authorName: string[];
  authorLink: string[];
};

export type authorType = {
  name: string;
  link: string;
};

export type XenForoDataType = {
  storyLink: string;
  storyName: string;
  authorLink: string;
  authorName: string;
};

export type FFProcessedStoryData = {
  authorLink: string;
  authorName: string;
  storyLink: string;
  storyTitle: string;
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
  };
  questionableQuesting: {
    following: boolean;
  };
  spaceBattles: {
    following: false;
  };
  sufficientVelocity: {
    following: false;
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
