import { router } from "../../trpc";
import { commentTheme } from "./commentTheme";
import { deleteComment } from "./deleteComment";
import { getAllComments } from "./getAllComments";

export const themeCommentRoute = router({
  /** お題にコメントする */
  comment: commentTheme,

  /** お題につけたコメントを削除する */
  deleteComment,

  /** お題についたコメントをすべて取得する */
  getAllComments,
});
