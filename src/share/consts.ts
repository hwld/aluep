export const pageLimit = {
  favoritedUsers: 50,
  developments: 20,
  searchedIdeas: 24,
  ideaLikingUsers: 20,
  developedIdeas: 18,
  likedIdeas: 18,
  postedIdeas: 18,
} as const;

// ステータスの意味とIDの関連付はprismaのスキーマを参照
/** 開発状況 */
export enum DevelopmentStatuses {
  /** 開発中 */
  IN_PROGRESS = 1,
  /** 開発中止 */
  ABORTED = 2,
  /** 開発完了 */
  COMPLETED = 3,
}
