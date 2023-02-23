import { ThemeOrder } from "./schema";
import { buildSearchParamsString } from "./utils";

export const Routes = {
  home: "/",

  /** アプリ開発のお題関連 */
  theme: (id: string) => `/themes/${id}`,
  themeCreate: "/themes/create",
  themeUpdate: (themeId: string) => `/themes/${themeId}/update`,
  themeJoin: (themeId: string) => `/themes/${themeId}/join`,
  themeSearch: (query?: { order?: ThemeOrder; tagIds?: string }) =>
    `/themes/search${buildSearchParamsString(query)}`,
  themeLikingUsers: (themeId: string) => `/themes/${themeId}/liking-users`,

  /** アプリ開発の開発者関連 */
  developers: (themeId: string) => `/themes/${themeId}/developers`,
  developer: (themeId: string, developerId: string) =>
    `${Routes.theme(themeId)}/developers/${developerId}/detail`,
  developerUpdate: (themeId: string, developerId: string) =>
    `${Routes.theme(themeId)}/developers/${developerId}/update`,

  /** ユーザー関連 */
  user: (id: string) => `/users/${id}`,
  userUpdate: "/users/profile",
  userDelete: "/users/delete",
  userSearch: "/users/search",
  userFavorites: (userId: string) => `/users/${userId}/favorite-list`,
  userWithPostedThemes: (userId: string) => `/users/${userId}/posted-themes`,
  userWithJoinedThemes: (userId: string) => `/users/${userId}/joined-themes`,
  userWithLikedThemes: (userId: string) => `/users/${userId}/liked-themes`,

  signout: "/signout",
  serverError: "/505",
  notFoundError: "/400",

  api: { uploadAvatar: "/api/upload-avatar" },
} as const;
