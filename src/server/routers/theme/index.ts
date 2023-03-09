import { router } from "../../lib/trpc";
import { createTheme } from "./createTheme";
import { deleteTheme } from "./deleteTheme";
import { getAllTags } from "./getAllTags";
import { getJoinedThemesByUser } from "./getJoinedThemesByUser";
import { getLikedThemesByUser } from "./getLikedThemesByUser";
import { getPostedThemesByUser } from "./getPostedThemesByUser";
import { getTheme } from "./getTheme";
import { getThemeLikeCountByUser } from "./getThemeLikeCountByUser";
import { joinedTheme } from "./joinedTheme";
import { joinTheme } from "./joinTheme";
import { likedTheme } from "./likedTheme";
import { likeTheme } from "./likeTheme";
import { searchTheme } from "./searchTheme";
import { updateTheme } from "./updateTheme";

export const themeRoute = router({
  /** すべてのタグを取得する */
  getAllTags,

  /** idを指定してテーマを取得する */
  get: getTheme,

  /** お題を検索する */
  search: searchTheme,

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

  /** 指定されたユーザーが投稿したお題についたすべての「いいね」を取得する */
  getLikeCountByUser: getThemeLikeCountByUser,

  /** 指定されたユーザーが投稿されたお題を取得する */
  getPostedThemesByUser,

  /** 指定されたユーザーが参加しているお題を取得する */
  getJoinedThemesByUser: getJoinedThemesByUser,

  /** 指定されたユーザーがいいねしたお題を取得する */
  getLikedThemesByUser,
});
