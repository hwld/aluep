import { ThemeOrder } from "./schema";
import { buildSearchParamsString } from "./utils";

export const Routes = {
  home: "/",

  /** アプリ開発のお題関連 */
  theme: (id: string) => `/themes/${id}`,
  themeCreate: "/themes/create",
  themeUpdate: (themeId: string) => `/themes/${themeId}/update`,
  themeDevelop: (themeId: string) => `/themes/${themeId}/develop`,
  themeSearch: (query?: { order?: ThemeOrder; tagIds?: string }) =>
    `/themes/search${buildSearchParamsString(query)}`,
  themeLikingUsers: (themeId: string) => `/themes/${themeId}/liking-users`,

  /** アプリ開発の開発関連 */
  developments: (themeId: string) => `/themes/${themeId}/developments`,
  development: (themeId: string, developmentId: string) =>
    `${Routes.theme(themeId)}/developments/${developmentId}/detail`,
  developmentUpdate: (themeId: string, developmentId: string) =>
    `${Routes.theme(themeId)}/developments/${developmentId}/update`,

  /** ユーザー関連 */
  user: (id: string) => `/users/${id}`,
  userUpdate: "/users/profile",
  userDelete: "/users/delete",
  userSearch: "/users/search",
  userFavorites: (userId: string) => `/users/${userId}/favorited-users`,
  userWithPostedThemes: (userId: string) => `/users/${userId}/posted-themes`,
  userWithDevelopedThemes: (userId: string) =>
    `/users/${userId}/developed-themes`,
  userWithLikedThemes: (userId: string) => `/users/${userId}/liked-themes`,

  signout: "/signout",
  serverError: "/505",
  notFoundError: "/400",

  api: { uploadAvatar: "/api/upload-avatar" },
} as const;
