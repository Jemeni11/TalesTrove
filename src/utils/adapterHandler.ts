import {
  getArchiveOfOurOwnData,
  getFFFavoritesData,
  getFFFollowingData,
  getXenForoData
} from "~adapters";
import type {
  BasicStoryAndAuthorType,
  FFProcessedStoryData,
  SubscriptionResult,
  XenForoSites
} from "~types";

type AdapterSuccess = {
  message:
    | BasicStoryAndAuthorType[]
    | FFProcessedStoryData[]
    | SubscriptionResult;
};

type AdapterError = {
  error: {
    name: string;
    message?: string;
    cause?: unknown;
    stack?: string;
  };
  message?:
    | BasicStoryAndAuthorType[]
    | FFProcessedStoryData[]
    | SubscriptionResult;
};

async function adapterHandler(
  site_id: string,
  body: {
    type?: Partial<Record<"author" | "work" | "series", boolean>>;
    username?: string;
    alternateTLD?: boolean;
  }
): Promise<AdapterSuccess | AdapterError> {
  const index = site_id.indexOf("Adapter");
  const result = index !== -1 ? site_id.slice(0, index) : site_id;

  try {
    let message: AdapterSuccess["message"];

    switch (site_id) {
      case "ArchiveOfOurOwnAdapter":
        const types_array =
          body.type != null
            ? (Object.entries(body.type)
                .filter(([_, value]) => value)
                .map(([key]) => key) as ("author" | "work" | "series")[])
            : [];

        message = await getArchiveOfOurOwnData(
          body.username,
          body.alternateTLD,
          types_array
        );
        break;
      case "FanFictionNetFollowingAdapter":
        message = await getFFFollowingData();
        break;
      case "FanFictionNetFavoritesAdapter":
        message = await getFFFavoritesData();
        break;
      case "QuestionableQuestingAdapter":
      case "SpaceBattlesAdapter":
      case "SufficientVelocityAdapter":
        message = await getXenForoData(result as XenForoSites);
        break;
      default:
        message = [];
    }

    return { message };
  } catch (error) {
    console.error(error);

    const partial = (error as any).partial;

    return {
      error: {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: error.stack
      },
      ...(partial && { message: partial })
    };
  }
}

export default adapterHandler;
