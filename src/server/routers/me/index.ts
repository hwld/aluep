import { router } from "../../trpc";
import { deleteMe } from "./deleteMe";
import { getMySummary } from "./getMySummary";
import { updateMe } from "./updateMe";

export const meRoute = router({
  /** プロフィールを更新する */
  update: updateMe,

  /** ユーザーを削除する */
  delete: deleteMe,

  /** ログインしているユーザーの情報を取得する */
  getMySummary,
});
