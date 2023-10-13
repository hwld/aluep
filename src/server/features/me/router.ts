import { deleteMe } from "@/server/features/me/deleteMe";
import { getMyGitHubRepositories } from "@/server/features/me/getMyGitHubRepositories";
import { getMySummary } from "@/server/features/me/getMySummary";
import { updateMe } from "@/server/features/me/updateMe";
import { router } from "@/server/lib/trpc";

export const meRoute = router({
  /** プロフィールを更新する */
  update: updateMe,

  /** ユーザーを削除する */
  delete: deleteMe,

  /** ログインしているユーザーの情報を取得する */
  getMySummary: getMySummary,

  /** ログインしているユーザーの公開リポジトリを取得する */
  getMyGitHubRepositories: getMyGitHubRepositories,
});
