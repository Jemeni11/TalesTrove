import type { PlasmoMessaging } from "@plasmohq/messaging";

import {
  getArchiveOfOurOwnData,
  getFFFavoritesData,
  getFFFollowingData,
  getQuestionableQuestingData
} from "~adapters";

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    const site_id = req.body.id;
    let message;

    switch (site_id) {
      case "qq":
        message = await getQuestionableQuestingData();
        break;
      case "ao3":
        message = await getArchiveOfOurOwnData(req.body?.username);
        break;
      case "fffollowing":
        message = await getFFFollowingData();
        break;
      case "fffavorites":
        message = await getFFFavoritesData();
        break;
    }

    console.log(`[DEBUG]: Inside the BSW ->`, message);
    console.log(
      `[DEBUG]: Inside the BSW (STRINGIFY) ->`,
      JSON.stringify(message)
    );

    res.send({
      message
    });
  } catch (error) {
    console.error(`[ERROR]: Failed to fetch data ->`, error);
    res.send({
      error: "Failed to fetch data"
    });
  }
};

export default handler;