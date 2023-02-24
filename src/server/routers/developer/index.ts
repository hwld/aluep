import { router } from "../../lib/trpc";
import { deleteDeveloper } from "./deleteDeveloper";
import { getDeveloper } from "./getDeveloper";
import { getDeveloperLikeCountByUser } from "./getDeveloperLikeCountByUser";
import { getDevelopersByTheme } from "./getDevelopersByTheme";
import { likeDeveloper } from "./likeDeveloper";
import { updateDeveloper } from "./updateDeveloper";

export const developerRoute = router({
  /** 開発者を取得する */
  get: getDeveloper,

  /** 指定されたお題の開発者一覧を取得する */
  getManyByTheme: getDevelopersByTheme,

  /** 開発者を削除する */
  delete: deleteDeveloper,

  /** 開発者を更新する */
  update: updateDeveloper,

  /** 開発者にいいねする */
  like: likeDeveloper,

  /** 指定されたユーザーの開発情報についたすべての「いいね」を取得する */
  getLikeCountByUser: getDeveloperLikeCountByUser,
});
