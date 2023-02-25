import { useQuery } from "@tanstack/react-query";
import { ThemeDeveloper } from "../../../server/models/themeDeveloper";
import { trpc } from "../../lib/trpc";
import { themeQueryKey } from "../theme/useThemeQuery";

const themeDevelopersQueryKey = (themeId: string) =>
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
      return trpc.developer.getManyByTheme.query({
        page: page.toString(),
        themeId,
      });
    },
    keepPreviousData: true,
  });

  return result;
};
