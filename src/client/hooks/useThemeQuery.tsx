import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { themesQueryKey } from "./usePaginatedThemesQuery";

export const themeQueryKey = (themeId: string) =>
  [...themesQueryKey, themeId] as const;

export const useThemeQuery = (themeId: string) => {
  const { data: theme, ...others } = useQuery({
    queryKey: themeQueryKey(themeId),
    queryFn: () => {
      return trpc.theme.get.query({ themeId });
    },
  });

  return { theme, ...others };
};
