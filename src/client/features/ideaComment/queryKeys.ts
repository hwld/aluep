import { ideaKeys } from "@/client/features/idea/queryKeys";

export const ideaCommentKeys = {
  listByIdea: (ideaId: string) =>
    [...ideaKeys.detail(ideaId), "comments"] as const,
} as const;
