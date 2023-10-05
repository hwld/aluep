export const pageLimit = {
  favoritedUsers: 50,
  developments: 20,
  searchedIdeas: 24,
  ideaLikers: 20,
  developmentLikers: 20,
  developmentsByUser: 18,
  likedIdeas: 18,
  likedDevelopments: 18,
  postedIdeas: 18,
} as const;

// 使ってるmodels/developmentStatus.tsに置く？
export const DevStatusIds = {
  /** 開発中 */
  IN_PROGRESS: "1",
  /** 開発中止 */
  ABORTED: "2",
  /** 開発完了 */
  COMPLETED: "3",
};
