import { createIdeaComment } from "@/server/features/ideaComment/createIdeaComment";
import { deleteIdeaComment } from "@/server/features/ideaComment/deleteComment";
import { getAllIdeaComments } from "@/server/features/ideaComment/getAllIdeaComments";
import { router } from "@/server/lib/trpc";

export const ideaCommentRoute = router({
  /** お題にコメントする */
  create: createIdeaComment,

  /** お題につけたコメントを削除する */
  delete: deleteIdeaComment,

  /** お題についたコメントをすべて取得する */
  getAll: getAllIdeaComments,
});
