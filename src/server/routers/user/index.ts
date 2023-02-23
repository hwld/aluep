import { router } from "../../trpc";
import { favorited } from "./favorited";
import { favoritedUserCounts } from "./favoritedUserCounts";
import { favoritedUserCountsAnother } from "./favoritedUserCountsAnother";
import { favoritedUsers } from "./favoritedUsers";
import { favoriteUser } from "./favoriteUser";
import { getJoinedTheme } from "./getJoinedTheme";
import { getLikeThemes } from "./getLikeThemes";
import { getPostedTheme } from "./getPostedTheme";
import { getThemeDeveloperLikes } from "./getThemeDeveloperLikes";
import { getThemeLikes } from "./getThemeLikes";
import { getUser } from "./getUser";
import { searchUser } from "./searchUser";
import { unfavoriteUser } from "./unfavoriteUser";

export const userRoute = router({
  /** 指定されたユーザーが投稿したお題を取得する */
  getPostTheme: getPostedTheme,

  /** 指定されたユーザが参加しているお題を取得する */
  getJoinTheme: getJoinedTheme,

  /** 指定されたユーザがいいねしたお題を取得する */
  getLikeTheme: getLikeThemes,

  /** 指定されたユーザーが投稿したお題についた「いいね」をすべて取得する */
  getThemeLike: getThemeLikes,

  /** 指定されたユーザーの開発情報についた「いいね」をすべて取得する */
  getThemeDeveloperLike: getThemeDeveloperLikes,

  /** ユーザーを取得する */
  get: getUser,

  /** ユーザーを検索する */
  searchUser,

  /** お気に入りを登録 */
  crateFavorite: favoriteUser,

  /** お気に入りの解除 */
  deleteFavorite: unfavoriteUser,

  /** ログインユーザーがお気に入りしているか */
  favorited,

  // TODO: これらを一つにまとめられそう
  /** 自分がお気に入りしている人数の合計 */
  favoritedSum: favoritedUserCounts,
  /** 他人がお気に入りしている人数の合計 */
  favoritedAnotherSum: favoritedUserCountsAnother,

  /** お気に入りリストの表示 */
  favoriteList: favoritedUsers,
});
