import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { themeQueryKey } from "./useThemeQuery";

export const themeDevelopersQueryKey = (themeId: string) =>
  [...themeQueryKey(themeId), "developers"] as const;

export const paginatedDeveloperQueryKey = (themeId: string, page: number) => {
  const p = isNaN(page) ? 1 : page;
  return [...themeDevelopersQueryKey(themeId), { page: p }] as const;
};

export const usePaginatedDeveloperQuery = (themeId: string, page: number) => {
  const result = useQuery({
    queryKey: paginatedDeveloperQueryKey(themeId, page),
    queryFn: () => {
      return trpc.theme.getDeveloperAllpage.query({
        page: page.toString(),
        themeId,
      });
    },
    keepPreviousData: true,
  });

  return result;
};
