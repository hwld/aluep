import { IdeaOrder } from "./schema";
import { buildSearchParamsString } from "./utils";

export const Routes = {
  home: "/",

  /** アプリ開発のお題関連 */
  ideas: `/ideas`,
  idea: (id: string) => `${Routes.ideas}/${id}`,
  ideaCreate: "/ideas/create",
  ideaUpdate: (ideaId: string) => `${Routes.idea(ideaId)}/update`,
  ideaSearch: (query?: { order?: IdeaOrder; tagIds?: string }) =>
    `${Routes.ideas}/search${buildSearchParamsString(query)}`,
  ideaLikingUsers: (ideaId: string) => `${Routes.ideas}/${ideaId}/liking-users`,

  /** アプリ開発のお題の開発関連 */
  develop: (ideaId: string) => `${Routes.ideas}/${ideaId}/develop`,
  developments: (ideaId: string) => `${Routes.ideas}/${ideaId}/developments`,
  development: (ideaId: string, developmentId: string) =>
    `${Routes.developments(ideaId)}/${developmentId}`,
  developmentUpdate: (ideaId: string, developmentId: string) =>
    `${Routes.development(ideaId, developmentId)}/update`,
  developmentLikingUsers: (ideaId: string, developmentId: string) =>
    `${Routes.development(ideaId, developmentId)}/liking-users`,

  /** ユーザー関連 */
  user: (id: string) => `/users/${id}`,
  userUpdate: "/users/profile",
  userDelete: "/users/delete",
  userSearch: "/users/search",
  userFavorites: (userId: string) => `/users/${userId}/favorited-users`,

  signout: "/signout",
  serverError: "/505",
  notFoundError: "/400",

  api: { uploadAvatar: "/api/upload-avatar" },
} as const;
