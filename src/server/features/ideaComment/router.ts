import { router } from "../../lib/trpc";
import { commentIdea } from "./commentIdea";
import { deleteComment } from "./deleteComment";
import { getAllComments } from "./getAllComments";

export const ideaCommentRoute = router({
  /** お題にコメントする */
  comment: commentIdea,

  /** お題につけたコメントを削除する */
  delete: deleteComment,

  /** お題についたコメントをすべて取得する */
  getAll: getAllComments,
});
