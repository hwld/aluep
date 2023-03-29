import { router } from "../../lib/trpc";
import { deleteDevelopment } from "./deleteDevelopment";
import { developIdea } from "./developIdea";
import { getDevelopment } from "./getDevelopment";
import { getDevelopmentLikeCountByUser } from "./getDevelopmentLikeCountByUser";
import { getDevelopmentsByIdea } from "./getDevelopmentsByIdea";
import { isDevelopedByUser } from "./isDevelopedByUser";
import { likeDevelopment } from "./likeDevelopment";
import { unlikeDevelopment } from "./unlikeDevelopment";
import { updateDevelopment } from "./updateDevelopment";

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

  /** 開発情報にいいねする */
  like: likeDevelopment,

  /** 開発情報のいいねを解除する */
  unlike: unlikeDevelopment,

  /** 指定されたユーザーの開発情報についたすべての「いいね」を取得する */
  getLikeCountByUser: getDevelopmentLikeCountByUser,
});
