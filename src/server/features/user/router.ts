import { router } from "../../lib/trpc";
import { getFavoritedUsers } from "./favoritedUsers";
import { favoriteUser } from "./favoriteUser";
import { getFavoriteCountByUser } from "./favoriteUsersCount";
import { getThemeLikingUsers } from "./getThemeLikingUsers";
import { getUser } from "./getUser";
import { isFavoritedByLoggedInUser } from "./isFavoritedByLoggedInUser";
import { searchUser } from "./searchUser";
import { unfavoriteUser } from "./unfavoriteUser";

export const userRoute = router({
  /** ユーザーを取得する */
  get: getUser,

  /** ユーザーを検索する */
  search: searchUser,

  /** お気に入りを登録 */
  favorite: favoriteUser,

  /** お気に入りの解除 */
  unfavorite: unfavoriteUser,

  /** ログインユーザーがお気に入りしているか */
  isFavoritedByLoggedInUser: isFavoritedByLoggedInUser,

  /** お気に入りしたユーザーの数を取得する */
  getFavoriteCountByUser: getFavoriteCountByUser,

  /** お気に入りユーザーを取得する */
  getFavoritedUsers: getFavoritedUsers,

  /** 指定されたお題をいいねしたユーザーを取得する */
  getThemeLikingUsers: getThemeLikingUsers,
});
