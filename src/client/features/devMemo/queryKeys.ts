import { developmentKeys } from "@/client/features/dev/queryKeys";

export const developmentMemoKeys = {
  listByDevelopment: (developmentId: string) =>
    [...developmentKeys.detail(developmentId), "memos"] as const,
} as const;
