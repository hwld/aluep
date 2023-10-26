import { getPickedIdeas } from "@/server/features/aggregate/getPickedIdeas";
import { getPopularDevelopers } from "@/server/features/aggregate/getPopularDevelopers";
import { getPopularIdeaAuthors } from "@/server/features/aggregate/getPopularIdeaAuthors";
import { getPopularIdeas } from "@/server/features/aggregate/getPopularIdeas";
import { getPopularIdeaTags } from "@/server/features/aggregate/getPopularIdeaTags";
import { router } from "@/server/lib/trpc";

export const aggregateRoute = router({
  /** いいねが多いお題を取得する */
  getPopularIdeas: getPopularIdeas,

  /** いいねが多い開発者を取得する */
  getPopularDevelopers: getPopularDevelopers,

  /** いいねが多いお題投稿者を取得する */
  getPopularIdeaAuthors: getPopularIdeaAuthors,

  /** 投稿の多いアイデアのタグを取得する */
  getPopularIdeaTags: getPopularIdeaTags,

  /** お題をいくつかピックアップする */
  getPickedIdeas: getPickedIdeas,
});
