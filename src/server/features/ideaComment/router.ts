import { router } from "../../lib/trpc";
import { createIdeaComment } from "./createIdeaComment";
import { deleteIdeaComment } from "./deleteComment";
import { getAllIdeaComments } from "./getAllIdeaComments";

export const ideaCommentRoute = router({
  /** お題にコメントする */
  create: createIdeaComment,

  /** お題につけたコメントを削除する */
  delete: deleteIdeaComment,

  /** お題についたコメントをすべて取得する */
  getAll: getAllIdeaComments,
});
