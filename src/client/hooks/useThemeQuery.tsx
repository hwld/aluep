import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themeQueryKey = (themeId: string) => ["theme", themeId];

export const useThemeQuery = (themeId: string) => {
  const { data: theme, ...others } = useQuery({
    queryKey: themeQueryKey(themeId),
    queryFn: () => {
      return trpc.theme.get.query({ themeId });
    },
  });

  return { theme, ...others };
};
