export const PAGE_LIMIT = {
  favoritedUsers: 50,
  devs: 50,
  searchedIdeas: 50,
  ideaLikers: 50,
  devLikers: 50,
  devsByUser: 51,
  likedIdeas: 51,
  likedDevs: 51,
  postedIdeas: 51,
} as const;

export const Bytes = {
  KB: 1024,
  MB: 1024 ** 2,
} as const;

export const UPLOAD_IMAGE_LIMIT_MB = 1;

export const TOTAL_UPLOAD_IMAGE_LIMIT_MB = 100;
