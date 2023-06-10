export const pageLimit = {
  favoritedUsers: 50,
  developments: 20,
  searchedIdeas: 24,
  ideaLikingUsers: 20,
  developedIdeas: 18,
  likedIdeas: 18,
  postedIdeas: 18,
} as const;

// TODO: server/models/developmentStatusに入れていたが、client側から参照するとPrismaがブラウザに混ざってしまう。
// 今はいろんなclient側のコードにserverのコードを呼び出す処理が入っていて、これやめたほうがいいと思った。
// 基本的に参照しているのはserver/models内の型定義などで、これらはshare/modelsとかに移したほうが良いかもしれない。
export const DevelopmentStatusIds = {
  /** 開発中 */
  IN_PROGRESS: "1",
  /** 開発中止 */
  ABORTED: "2",
  /** 開発完了 */
  COMPLETED: "3",
};
