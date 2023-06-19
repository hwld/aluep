import { IdeaOrder } from "../../../share/schema";
import { userKeys } from "../user/queryKeys";
import { UseSearchedIdeasQueryArgs } from "./useSearchedIdeasQuery";

export const ideaKeys = {
  all: ["ideas"] as const,
  allTags: ["allTags"] as const,
  detail: (ideaId: string) => [...ideaKeys.all, ideaId] as const,

  /** 検索されたお題のリスト */
  searchedList: (args: UseSearchedIdeasQueryArgs) =>
    [...ideaKeys.all, { ...args }] as const,

  /** 特定のユーザーがお題をいいねしているか */
  isLiked: (ideaId: string, userId: string | undefined) =>
    [...ideaKeys.detail(ideaId), "users", userId ?? "", "liked"] as const,

  /** 特定のユーザーが投稿したpageページ目のお題のリスト */
  postedListPerPage: (userId: string, page: number) =>
    [
      ...userKeys.detail(userId),
      "posted-ideas",
      { page: isNaN(page) ? 1 : page },
    ] as const,

  /** 特定のユーザーがいいねしたpageページ目のお題のリスト */
  likedListPerPage: (userId: string, page: number) =>
    [
      userKeys.detail(userId),
      "liked-ideas",
      { page: isNaN(page) ? 1 : page },
    ] as const,

  /** 特定の基準でピックアップされたお題のリスト */
  pickedUpList: (order: IdeaOrder) =>
    [...ideaKeys.all, "picked-up", order] as const,

  /** いいねが多かったお題Top10 */
  top10LikesIdeasInThisMonth: ["top10LikesIdeasInThisMonth"],
} as const;
