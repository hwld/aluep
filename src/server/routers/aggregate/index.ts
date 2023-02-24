import { router } from "../../lib/trpc";
import { getTop10LikesDevelopersInThisMonth } from "./getTop10LikesDevelopersInThisMonth";
import { getTop10LikesPostersInThisMonth } from "./getTop10LikesPostersInThisMonth";
import { getTop10LikesThemesInThisMonth } from "./getTop10LikesThemesInThisMonth";
import { pickUpThemes } from "./pickupThemes";

export const aggregateRoute = router({
  /** 1ヶ月間でいいねが多かったお題Top10を取得する */
  getTop10LikesThemesInThisMonth,

  /** 1ヶ月間でいいねが多かった開発者Top10を取得する */
  getTop10LikesDevelopersInThisMonth,

  /** 1ヶ月間でいいねが多かったお題投稿者Top10を取得する */
  getTop10LikesPostersInThisMonth,

  /** お題をいくつかピックアップする */
  pickUpThemes,
});
