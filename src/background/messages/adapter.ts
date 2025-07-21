import type { PlasmoMessaging } from "@plasmohq/messaging";

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

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const site_id: string = req.body.id;
  const index = site_id.indexOf("Adapter");
  const result = index !== -1 ? site_id.slice(0, index) : site_id;

  try {
    let message:
      | BasicStoryAndAuthorType[]
      | FFProcessedStoryData[]
      | SubscriptionResult;

    switch (site_id) {
      case "ArchiveOfOurOwnAdapter":
        const types_array = Object.entries(req.body.type)
          .filter(([_, value]) => value)
          .map(([key]) => key) as ("author" | "work" | "series")[];
        message = await getArchiveOfOurOwnData(
          req.body?.username,
          req.body?.alternateTLD,
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

    res.send({ message });
  } catch (error) {
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
