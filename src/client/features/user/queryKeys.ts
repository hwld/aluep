import { developmentKeys } from "../development/queryKeys";
import { ideaKeys } from "../idea/queryKeys";

export const userKeys = {
  all: ["users"] as const,
  detail: (userId: string) => [...userKeys.all, userId] as const,

  activity: (userId: string) =>
    [...userKeys.detail(userId), "activity"] as const,

  searchedList: (userName: string) =>
    [...userKeys.all, "search", userName] as const,

  /** 指定されたユーザーが受け取ったすべてのいいねの数 */
  receivedLikeCount: (userId: string) =>
    [...userKeys.detail(userId), "received-like-count"] as const,

  /** 指定された開発情報をいいねしたユーザーを取得する */
  developmentLikers: (developmentId: string, page: number) =>
    [
      ...developmentKeys.detail(developmentId),
      "likers",
      { page: isNaN(page) ? 1 : page },
    ] as const,

  /** 指定されたお題をいいねしたユーザーを取得する */
  ideaLikers: (ideaId: string, page: number) =>
    [
      ...ideaKeys.detail(ideaId),
      "likers",
      { page: isNaN(page) ? 1 : page },
    ] as const,

  /** 指定したユーザーがお気に入り登録したユーザーを取得する */
  favoritedList: (userId: string, page: number) =>
    [
      ...userKeys.detail(userId),
      "favorited-users",
      { page: isNaN(page) ? 1 : page },
    ] as const,

  /**
   * ログインしているユーザーが指定したユーザーをお気に入り登録しているか
   * @param targetUserId このユーザーをお気に入り登録しているか
   * @param loggedInUserId このユーザーがお気に入り登録しているか
   */
  isFavorited: (targetUserId: string, loggedInUserId: string | undefined) =>
    [...userKeys.detail(targetUserId), "favorited-by", loggedInUserId] as const,

  /** 指定したユーザーがお気に入り登録しているユーザーの数 */
  favoriteCount: (userId: string) =>
    [...userKeys.detail(userId), "favorite-count"] as const,

  /** いいねが多かった開発者Top10 */
  top10LikesDevelopmentsInThisMonth: ["top10LikesDevelopmentsInThisMonth"],

  /** いいねが多かった投稿者Top10 */
  top10LikesPostersInThisMonth: ["Top10LikesPostersInThisMonth"],
};
