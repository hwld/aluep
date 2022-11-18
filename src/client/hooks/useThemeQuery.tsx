import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themeQueryKey = (themeId: string) => [`theme-${themeId}`];

export const useThemeQuery = (themeId: string) => {
  const { data: theme, ...others } = useQuery(themeQueryKey(themeId), () => {
    return trpc.themes.get.query({ themeId });
  });

  return { theme, ...others };
};
