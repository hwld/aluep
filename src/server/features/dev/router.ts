import { createDev } from "@/server/features/dev/createDev";
import { deleteDev } from "@/server/features/dev/deleteDev";
import { getDev } from "@/server/features/dev/getDev";
import { getDevsByIdea } from "@/server/features/dev/getDevsByIdea";
import { getDevsByUser } from "@/server/features/dev/getDevsByUser";
import { getLikedDevsByUser } from "@/server/features/dev/getLikedDevsByUser";
import { isDevelopedByUser } from "@/server/features/dev/isDevelopedByUser";
import { likeDev } from "@/server/features/dev/likeDev";
import { unlikeDev } from "@/server/features/dev/unlikeDev";
import { updateAllowOtherUserMemos } from "@/server/features/dev/updateAllowOtherUserMemos";
import { updateDev } from "@/server/features/dev/updateDev";
import { router } from "@/server/lib/trpc";

export const devRoute = router({
  /** お題の開発情報を作成する(開発する) */
  create: createDev,

  /** 開発情報を取得する */
  get: getDev,

  /** 指定されたお題の開発情報一覧を取得する */
  getManyByIdea: getDevsByIdea,

  /** 指定されたユーザーの開発情報が存在するか */
  isDevelopedByUser: isDevelopedByUser,

  /** 開発情報を削除する */
  delete: deleteDev,

  /** 開発情報を更新する */
  update: updateDev,

  /** 他のユーザーがメモに返信できるかを更新する */
  updateAllowOtherUserMemos: updateAllowOtherUserMemos,

  /** 開発情報にいいねする */
  like: likeDev,

  /** 開発情報のいいねを解除する */
  unlike: unlikeDev,

  /** 指定したユーザーが開発しているお題と開発情報の概要を取得する */
  getDevsByUser: getDevsByUser,

  /** 指定したユーザーがいいねした開発情報を取得する */
  getLikedDevsByUser: getLikedDevsByUser,
});
