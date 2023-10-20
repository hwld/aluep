import { deleteUserUploadedImage } from "@/server/features/user/deleteUserUploadedImage";
import { getFavoritedUsers } from "@/server/features/user/favoritedUsers";
import { favoriteUser } from "@/server/features/user/favoriteUser";
import { getFavoriteCountByUser } from "@/server/features/user/favoriteUserCount";
import { getDevLikers } from "@/server/features/user/getDevLikers";
import { getIdeaLikers } from "@/server/features/user/getIdeaLikers";
import { getReceivedLikeCount } from "@/server/features/user/getReceivedLikeCount";
import { getUser } from "@/server/features/user/getUser";
import { getUserActivity } from "@/server/features/user/getUserActivity";
import { getuserUploadedImages } from "@/server/features/user/getUserUploadedImageUrls";
import { isFavoritedByLoggedInUser } from "@/server/features/user/isFavoritedByLoggedInUser";
import { searchUser } from "@/server/features/user/searchUser";
import { unfavoriteUser } from "@/server/features/user/unfavoriteUser";
import { router } from "@/server/lib/trpc";

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
  getIdeaLikers: getIdeaLikers,

  /** 指定された開発情報をいいねしたユーザーを取得する */
  getDevLikers: getDevLikers,

  /** ユーザーのアクティビティを取得する */
  getUserActivity: getUserActivity,

  /** ユーザーがもらったいいねの数を取得する */
  getReceivedLikeCount: getReceivedLikeCount,

  /** ユーザーがアップロードした画像の情報を取得する */
  getUserUploadedImages: getuserUploadedImages,

  /** ユーザーがアップロードした画像を削除する */
  deleteUserUploadedImage: deleteUserUploadedImage,
});
