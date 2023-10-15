import { createIdea } from "@/server/features/idea/createIdea";
import { deleteIdea } from "@/server/features/idea/deleteIdea";
import { getAllTags } from "@/server/features/idea/getAllTags";
import { getIdea } from "@/server/features/idea/getIdea";
import { getLikedIdeasByUser } from "@/server/features/idea/getLikedIdeasByUser";
import { getPostedIdeasByUser } from "@/server/features/idea/getPostedIdeasByUser";
import { likeIdea } from "@/server/features/idea/likeIdea";
import { searchIdeas } from "@/server/features/idea/searchIdeas";
import { unlikeIdea } from "@/server/features/idea/unlikeIdea";
import { updateIdea } from "@/server/features/idea/updateIdea";
import { router } from "@/server/lib/trpc";

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

  /** 指定されたユーザーが投稿したお題を取得する */
  getPostedIdeasByUser: getPostedIdeasByUser,

  /** 指定されたユーザーがいいねしたお題を取得する */
  getLikedIdeasByUser: getLikedIdeasByUser,
});
