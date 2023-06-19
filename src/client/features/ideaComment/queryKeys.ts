import { ideaKeys } from "../idea/queryKeys";

export const ideaCommentKeys = {
  listByIdea: (ideaId: string) =>
    [...ideaKeys.detail(ideaId), "comments"] as const,
} as const;
