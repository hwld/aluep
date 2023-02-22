import { ThemeOrder } from "./schema";
import { buildSearchParamsString } from "./utils";

export const Routes = {
  home: "/",

  theme: (id: string) => `/themes/${id}`,
  createTheme: "/themes/create",
  updateTheme: (themeId: string) => `/themes/${themeId}/update`,
  joinTheme: (themeId: string) => `/themes/${themeId}/join`,
  themeLikingUsers: (themeId: string) => `/themes/${themeId}/liking-users`,
  searchTheme: (query?: { order?: ThemeOrder; tagIds?: string }) =>
    `/themes/search${buildSearchParamsString(query)}`,

  developers: (themeId: string) => `/themes/${themeId}/developers`,
  developer: (themeId: string, developerId: string) =>
    `${Routes.theme(themeId)}/developers/${developerId}/detail`,
  updateDeveloper: (themeId: string, developerId: string) =>
    `${Routes.theme(themeId)}/developers/${developerId}/update`,

  user: (id: string) => `/users/${id}`,
  updateUser: "/users/profile",
  deleteUser: "/users/delete",
  searchUser: "/users/search",
  userFavorites: (userId: string) => `/users/${userId}/favorite-list`,
  userWithPostedThemes: (userId: string) => `/users/${userId}/posted-themes`,
  userWithJoinedThemes: (userId: string) => `/users/${userId}/joined-themes`,
  userWithLikedThemes: (userId: string) => `/users/${userId}/liked-themes`,

  signout: "/signout",
  serverError: "/505",
  notFoundError: "/400",

  api: { uploadAvatar: "/api/upload-avatar" },
} as const;
