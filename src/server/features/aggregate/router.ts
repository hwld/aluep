import { router } from "../../lib/trpc";
import { getPickedThemes } from "./getPickedThemes";
import { getTop10LikesDevelopmentsInThisMonth } from "./getTop10LikesDevelopmentsInThisMonth";
import { getTop10LikesPostersInThisMonth } from "./getTop10LikesPostersInThisMonth";
import { getTop10LikesThemesInThisMonth } from "./getTop10LikesThemesInThisMonth";

export const aggregateRoute = router({
  /** 1ヶ月間でいいねが多かったお題Top10を取得する */
  getTop10LikesThemesInThisMonth: getTop10LikesThemesInThisMonth,

  /** 1ヶ月間でいいねが多かった開発者Top10を取得する */
  getTop10LikesDevelopmentsInThisMonth: getTop10LikesDevelopmentsInThisMonth,

  /** 1ヶ月間でいいねが多かったお題投稿者Top10を取得する */
  getTop10LikesPostersInThisMonth: getTop10LikesPostersInThisMonth,

  /** お題をいくつかピックアップする */
  getPickedThemes: getPickedThemes,
});
