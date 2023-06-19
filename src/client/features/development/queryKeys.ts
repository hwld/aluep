import { ideaKeys } from "../idea/queryKeys";
import { userKeys } from "../user/queryKeys";

export const developmentKeys = {
  all: ["developments"] as const,

  detail: (developmentId: string) =>
    [...developmentKeys.all, developmentId] as const,
  allStatuses: ["development-statuses"] as const,

  /** pageページ目の特定のお題の開発情報のリスト */
  listByIdea: (ideaId: string, page: number) =>
    [...ideaKeys.detail(ideaId), "developments", { page }] as const,

  /** 指定されたユーザーの開発情報 */
  listByUser: (userId: string, page: number) =>
    [...userKeys.detail(userId), "user-developments", { page }] as const,

  /** 特定のユーザーがいいねしたpageページ目の開発情報のリスト */
  likedList: (userId: string, page: number) =>
    [...userKeys.detail(userId), "liked-developments", { page }] as const,

  /** 特定のユーザーがお題を開発しているか */
  isDeveloped: (ideaId: string, userId: string | undefined) =>
    [...ideaKeys.detail(ideaId), "users", userId ?? "", "developed"] as const,
} as const;
