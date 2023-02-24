import { router } from "../../lib/trpc";
import { reportDeveloper } from "./reportDeveloper";
import { reportTheme } from "./reportTheme";
import { reportThemeComment } from "./reportThemeComment";
import { reportUser } from "./reportUser";

export const reportRouter = router({
  /**お題を通報する */
  theme: reportTheme,

  /**お題のコメントを通報する */
  themeComment: reportThemeComment,

  /**開発情報を通報する */
  developer: reportDeveloper,

  /**ユーザーを通報する */
  user: reportUser,
});
