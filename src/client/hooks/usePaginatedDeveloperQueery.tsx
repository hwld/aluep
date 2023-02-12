import { useQuery } from "@tanstack/react-query";
import { ThemeDeveloper } from "../../server/models/themeDeveloper";
import { trpc } from "../trpc";
import { themeQueryKey } from "./useThemeQuery";

export const themeDevelopersQueryKey = (themeId: string) =>
  [...themeQueryKey(themeId), "developers"] as const;

export const paginatedDevelopersQueryKey = (themeId: string, page: number) => {
  const p = isNaN(page) ? 1 : page;
  return [...themeDevelopersQueryKey(themeId), { page: p }] as const;
};

export type PaginatedDeveloperQueryData = {
  developers: ThemeDeveloper[];
  allPages: number;
};
export const usePaginatedDeveloperQuery = (themeId: string, page: number) => {
  const result = useQuery({
    queryKey: paginatedDevelopersQueryKey(themeId, page),
    queryFn: (): Promise<PaginatedDeveloperQueryData> => {
      return trpc.theme.getDeveloperAllpage.query({
        page: page.toString(),
        themeId,
      });
    },
    keepPreviousData: true,
  });

  return result;
};
