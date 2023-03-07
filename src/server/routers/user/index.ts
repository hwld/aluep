import { router } from "../../lib/trpc";
import { favorited } from "./favorited";
import { favoritedUsers } from "./favoritedUsers";
import { favoriteUser } from "./favoriteUser";
import { favoriteUsersCount } from "./favoriteUsersCount";
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

  /** お気に入りしたユーザーの数を取得する */
  favoriteUsersCount,

  /** お気に入りユーザーを取得する */
  favoritedUsers: favoritedUsers,

  /** 指定されたお題をいいねしたユーザーを取得する */
  getThemeLikingUsers,
});
