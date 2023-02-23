import { router } from "../../trpc";
import { deleteMe } from "./deleteMe";
import { getInfo } from "./getInfo";
import { updateMe } from "./updateMe";

export const meRoute = router({
  /** プロフィールを更新する */
  update: updateMe,

  /** ユーザーを削除する */
  delete: deleteMe,

  /** ログインしているユーザーの詳細情報を取得する */
  getInfo: getInfo,
});
