import { router } from "../../trpc";
import { getTop10LikesDevelopersInThisMonth } from "../aggregate/getTop10LikesDevelopersInThisMonth";
import { getTop10LikesPostersInThisMonth } from "../aggregate/getTop10LikesPostersInThisMonth";
import { getTop10LikesThemesInThisMonth } from "../aggregate/getTop10LikesThemesInThisMonth";
import { pickUpThemes } from "../aggregate/pickupThemes";
import { commentTheme } from "../themeComment/commentTheme";
import { deleteComment } from "../themeComment/deleteComment";
import { getAllComments } from "../themeComment/getAllComments";
import { getDevelopers } from "../themeDeveloper/getDevelopers";
import { getThemeLikingUsers } from "../user/getThemeLikingUsers";
import { createTheme } from "./createTheme";
import { deleteTheme } from "./deleteTheme";
import { getAllTags } from "./getAllTags";
import { getTheme } from "./getTheme";
import { joinedTheme } from "./joinedTheme";
import { joinTheme } from "./joinTheme";
import { likedTheme } from "./likedTheme";
import { likeTheme } from "./likeTheme";
import { searchTheme } from "./searchTheme";
import { updateTheme } from "./updateTheme";

export const themeRoute = router({
  /** 開発者の一覧を取得する */
  getDevelopers,

  /** すべてのタグを取得する */
  getAllTags,

  /** idを指定してテーマを取得する */
  get: getTheme,

  /** お題を検索する */
  search: searchTheme,

  /** お題をいくつかピックアップする */
  pickUp: pickUpThemes,

  /** お題を作成する */
  create: createTheme,

  /** お題を更新する */
  update: updateTheme,

  /**　お題を削除する */
  delete: deleteTheme,

  /** お題に参加する */
  join: joinTheme,

  /** ログインユーザーが指定されたお題に参加しているか */
  joined: joinedTheme,

  /** お題にいいね・いいね解除する */
  like: likeTheme,

  /** ログインユーザーがお題をいいねしているか */
  liked: likedTheme,

  /** 指定されたお題をいいねしたユーザーを取得する */
  getThemeLikingUsers,

  /** 1ヶ月間でいいねが多かった投稿を取得する */
  getTop10LikesThemesInThisMonth,

  /** 1ヶ月間でいいねが多かった開発者ユーザーTop10を取得する */
  getTop10LikesDevelopersInThisMonth,

  /** 1カ月間でいいねが多かった投稿者Top10を取得する */
  getTop10LikesPostersInThisMonth,

  /** お題にコメントを投稿する */
  comment: commentTheme,

  /** お題につけたコメントを削除する */
  deleteComment,

  /** お題についたコメントをすべて取得する */
  getAllComments,
});
