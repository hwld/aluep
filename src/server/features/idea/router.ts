import { router } from "../../lib/trpc";
import { createIdea } from "./createIdea";
import { deleteIdea } from "./deleteIdea";
import { getAllTags } from "./getAllTags";
import { getDevelopedIdeasByUser } from "./getDevelopedIdeasByUser";
import { getIdea } from "./getIdea";
import { getIdeaLikeCountByUser } from "./getIdeaLikeCountByUser";
import { getLikedIdeasByUser } from "./getLikedIdeasByUser";
import { getPostedIdeasByUser } from "./getPostedIdeasByUser";
import { isLikedByUser } from "./isLikedByUser";
import { likeIdea } from "./likeIdea";
import { searchIdeas } from "./searchIdeas";
import { unlikeIdea } from "./unlikeIdea";
import { updateIdea } from "./updateIdea";

export const ideaRoute = router({
  /** すべてのタグを取得する */
  getAllTags: getAllTags,

  /** idを指定してテーマを取得する */
  get: getIdea,

  /** お題を検索する */
  search: searchIdeas,

  /** お題を作成する */
  create: createIdea,

  /** お題を更新する */
  update: updateIdea,

  /**　お題を削除する */
  delete: deleteIdea,

  /** お題にいいねする */
  like: likeIdea,

  /** お題のいいねを解除する */
  unlike: unlikeIdea,

  /** ログインユーザーがお題をいいねしているか */
  isLikedByUser: isLikedByUser,

  /** 指定されたユーザーが投稿したお題についたすべての「いいね」を取得する */
  getLikeCountByUser: getIdeaLikeCountByUser,

  /** 指定されたユーザーが投稿したお題を取得する */
  getPostedIdeasByUser: getPostedIdeasByUser,

  /** 指定されたユーザーが開発しているお題を取得する */
  getDevelopedIdeasByUser: getDevelopedIdeasByUser,

  /** 指定されたユーザーがいいねしたお題を取得する */
  getLikedIdeasByUser: getLikedIdeasByUser,
});
