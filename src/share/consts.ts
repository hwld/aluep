export const pageLimit = {
  favoritedUsers: 50,
  developments: 20,
  searchedIdeas: 24,
  ideaLikingUsers: 20,
  developmentLikingUsers: 20,
  userDevelopments: 18,
  likedIdeas: 18,
  likedDevelopments: 18,
  postedIdeas: 18,
} as const;

export const DevelopmentStatusIds = {
  /** 開発中 */
  IN_PROGRESS: "1",
  /** 開発中止 */
  ABORTED: "2",
  /** 開発完了 */
  COMPLETED: "3",
};
