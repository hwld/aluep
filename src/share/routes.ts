import { IdeaOrder } from "@/models/idea";
import { buildSearchParamsString } from "@/share/utils";

export const Routes = {
  home: "/",

  about: "/about",

  /** アプリ開発のお題関連 */
  ideas: `/ideas`,
  idea: (id: string) => `${Routes.ideas}/${id}`,
  ideaCreate: "/ideas/create",
  ideaUpdate: (ideaId: string) => `${Routes.idea(ideaId)}/update`,
  ideaSearch: (query?: { order?: IdeaOrder; tagIds?: string }) =>
    `${Routes.ideas}/search${buildSearchParamsString(query)}`,
  ideaLikers: (ideaId: string) => `${Routes.ideas}/${ideaId}/likers`,

  /** アプリ開発のお題の開発関連 */
  develop: (ideaId: string) => `${Routes.ideas}/${ideaId}/develop`,
  devs: (ideaId: string) => `${Routes.ideas}/${ideaId}/devs`,
  dev: (devId: string) => `/devs/${devId}`,
  devUpdate: (devId: string) => `${Routes.dev(devId)}/update`,
  devLikers: (devId: string) => `${Routes.dev(devId)}/likers`,

  /** ユーザー関連 */
  user: (id: string) => `/users/${id}`,
  userUpdate: "/users/profile",
  userDelete: "/users/delete",
  userSearch: "/users/search",
  userFavorites: (userId: string) => `${Routes.user(userId)}/favorited-users`,
  userUploadedImages: (userId: string) =>
    `${Routes.user(userId)}/uploaded-images`,

  signout: "/signout",
  serverError: "/505",
  notFoundError: "/400",

  api: {
    uploadAvatar: "/api/upload-avatar",
    uploadIdeaImage: "/api/upload-idea-image",
  },
} as const;
