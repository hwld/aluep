import { router } from "../../trpc";
import { favorited } from "./favorited";
import { favoritedUserCounts } from "./favoritedUserCounts";
import { favoritedUserCountsAnother } from "./favoritedUserCountsAnother";
import { favoritedUsers } from "./favoritedUsers";
import { favoriteUser } from "./favoriteUser";
import { getThemeLikingUsers } from "./getThemeLikingUsers";
import { getUser } from "./getUser";
import { searchUser } from "./searchUser";
import { unfavoriteUser } from "./unfavoriteUser";

export const userRoute = router({
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

  /** 指定されたお題をいいねしたユーザーを取得する */
  getThemeLikingUsers,
});
