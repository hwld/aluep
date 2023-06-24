import { developmentKeys } from "@/client/features/development/queryKeys";

export const developmentMemoKeys = {
  listByDevelopment: (developmentId: string) =>
    [...developmentKeys.detail(developmentId), "memos"] as const,
} as const;
