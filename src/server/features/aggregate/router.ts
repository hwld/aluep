import { getPickedIdeas } from "@/server/features/aggregate/getPickedIdeas";
import { getPopularIdeaTags } from "@/server/features/aggregate/getPopularIdeaTags";
import { getTop10LikesDevsInThisMonth } from "@/server/features/aggregate/getTop10LikesDevsInThisMonth";
import { getTop10LikesIdeasInThisMonth } from "@/server/features/aggregate/getTop10LikesIdeasInThisMonth";
import { getTop10LikesPostersInThisMonth } from "@/server/features/aggregate/getTop10LikesPostersInThisMonth";
import { router } from "@/server/lib/trpc";

export const aggregateRoute = router({
  /** 1ヶ月間でいいねが多かったお題Top10を取得する */
  getTop10LikesIdeasInThisMonth: getTop10LikesIdeasInThisMonth,

  /** 1ヶ月間でいいねが多かった開発者Top10を取得する */
  getTop10LikesDevsInThisMonth: getTop10LikesDevsInThisMonth,

  /** 1ヶ月間でいいねが多かったお題投稿者Top10を取得する */
  getTop10LikesPostersInThisMonth: getTop10LikesPostersInThisMonth,

  /** 投稿の多いアイデアのタグを取得する */
  getPopularIdeaTags: getPopularIdeaTags,

  /** お題をいくつかピックアップする */
  getPickedIdeas: getPickedIdeas,
});
