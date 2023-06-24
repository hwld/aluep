import { reportDevelopment } from "@/server/features/report/reportDevelopment";
import { reportDevelopmentMemo } from "@/server/features/report/reportDevelopmentMemo";
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
  development: reportDevelopment,

  /**ユーザーを通報する */
  user: reportUser,

  /**開発メモを通報する */
  developmentMemo: reportDevelopmentMemo,
});
