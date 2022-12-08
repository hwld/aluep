import { useQuery, useQueryClient } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themelikesQueryKey = (themeId: string) => ["users", themeId];

export const useThemeLikesQuery = (themeId: string) => {
  const queryClient = useQueryClient();
  const { data: users, ...others } = useQuery(themelikesQueryKey(themeId), () => {
    return trpc.theme.getLikedUsers.query({ themeId });
  });

  return { users, ...others };
};