import type { PlasmoMessaging } from "@plasmohq/messaging";

import {
  getArchiveOfOurOwnData,
  getFFFavoritesData,
  getFFFollowingData,
  getQuestionableQuestingData,
  getSpaceBattlesData
} from "~adapters";
import type {
  FFProcessedStoryData,
  SubscriptionResult,
  XenForoDataType
} from "~types";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const site_id: string = req.body.id;

  try {
    let message:
      | XenForoDataType[]
      | FFProcessedStoryData[]
      | SubscriptionResult;

    if (site_id === "ArchiveOfOurOwnAdapter") {
      const types_array = Object.entries(req.body.type)
        .filter(([_, value]) => value)
        .map(([key]) => key) as ("author" | "work" | "series")[];
      message = await getArchiveOfOurOwnData(req.body?.username, types_array);
    } else {
      switch (site_id) {
        case "QuestionableQuestingAdapter":
          message = await getQuestionableQuestingData();
          break;
        case "SpaceBattlesAdapter":
          message = await getSpaceBattlesData();
          break;
        case "FanFictionNetFollowingAdapter":
          message = await getFFFollowingData();
          break;
        case "FanFictionNetFavoritesAdapter":
          message = await getFFFavoritesData();
          break;
        default:
          message = [];
      }
    }

    res.send({ message });
  } catch (error) {
    const index = site_id.indexOf("Adapter");
    const result = index !== -1 ? site_id.slice(0, index) : site_id;

    error.name = result;
    console.error(error);

    res.send({
      error: {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: error.stack
      }
    });
  }
};

export default handler;
