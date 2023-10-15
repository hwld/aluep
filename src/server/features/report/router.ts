import { reportDev } from "@/server/features/report/reportDev";
import { reportDevMemo } from "@/server/features/report/reportDevMemo";
import { reportIdea } from "@/server/features/report/reportIdea";
import { reportIdeaComment } from "@/server/features/report/reportIdeaComment";
import { reportUser } from "@/server/features/report/reportUser";
import { router } from "@/server/lib/trpc";

export const reportRouter = router({
  /**お題を通報する */
  idea: reportIdea,

  /**お題のコメントを通報する */
  ideaComment: reportIdeaComment,

  /**開発情報を通報する */
  dev: reportDev,

  /**ユーザーを通報する */
  user: reportUser,

  /**開発メモを通報する */
  devMemo: reportDevMemo,
});
