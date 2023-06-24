import { deleteDevelopment } from "@/server/features/development/deleteDevelopment";
import { developIdea } from "@/server/features/development/developIdea";
import { getDevelopment } from "@/server/features/development/getDevelopment";
import { getDevelopmentStatuses } from "@/server/features/development/getDevelopmentStatuses";
import { getDevelopmentsByIdea } from "@/server/features/development/getDevelopmentsByIdea";
import { getDevelopmentsByUser } from "@/server/features/development/getDevelopmentsByUser";
import { getLikedDevelopmentsByUser } from "@/server/features/development/getLikedDevelopmentsByUser";
import { isDevelopedByUser } from "@/server/features/development/isDevelopedByUser";
import { likeDevelopment } from "@/server/features/development/likeDevelopment";
import { unlikeDevelopment } from "@/server/features/development/unlikeDevelopment";
import { updateAllowOtherUserMemos } from "@/server/features/development/updateAllowOtherUserMemos";
import { updateDevelopment } from "@/server/features/development/updateDevelopment";
import { router } from "@/server/lib/trpc";

export const developmentRoute = router({
  /** お題の開発情報を作成する(開発する) */
  create: developIdea,

  /** 開発情報を取得する */
  get: getDevelopment,

  /** 指定されたお題の開発情報一覧を取得する */
  getManyByIdea: getDevelopmentsByIdea,

  /** 指定されたユーザーの開発情報が存在するか */
  isDevelopedByUser: isDevelopedByUser,

  /** 開発情報を削除する */
  delete: deleteDevelopment,

  /** 開発情報を更新する */
  update: updateDevelopment,

  /** 他のユーザーがメモに返信できるかを更新する */
  updateAllowOtherUserMemos: updateAllowOtherUserMemos,

  /** 開発情報にいいねする */
  like: likeDevelopment,

  /** 開発情報のいいねを解除する */
  unlike: unlikeDevelopment,

  /** 開発状況の一覧を取得する */
  getDevelopmentStatuses: getDevelopmentStatuses,

  /** 指定したユーザーが開発しているお題と開発情報の概要を取得する */
  getDevelopmentsByUser: getDevelopmentsByUser,

  /** 指定したユーザーがいいねした開発情報を取得する */
  getLikedDevelopmentsByUser: getLikedDevelopmentsByUser,
});
