import { router } from "../../lib/trpc";
import { reportDevelopment } from "./reportDevelopment";
import { reportIdea } from "./reportIdea";
import { reportIdeaComment } from "./reportIdeaComment";
import { reportUser } from "./reportUser";

export const reportRouter = router({
  /**お題を通報する */
  idea: reportIdea,

  /**お題のコメントを通報する */
  ideaComment: reportIdeaComment,

  /**開発情報を通報する */
  development: reportDevelopment,

  /**ユーザーを通報する */
  user: reportUser,
});
