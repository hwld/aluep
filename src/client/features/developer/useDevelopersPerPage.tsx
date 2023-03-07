import { useQuery } from "@tanstack/react-query";
import { ThemeDeveloper } from "../../../server/models/themeDeveloper";
import { trpc } from "../../lib/trpc";
import { themeQueryKey } from "../theme/useThemeQuery";

export const developersPerPageQueryKey = (themeId: string, page: number) => {
  const p = isNaN(page) ? 1 : page;
  return [...themeQueryKey(themeId), "developers", { page: p }] as const;
};

export type DevelopersPerPageData = {
  list: ThemeDeveloper[];
  allPages: number;
};

export const useDevelopersPerPage = (themeId: string, page: number) => {
  const { data: developersPerPage, ...others } = useQuery({
    queryKey: developersPerPageQueryKey(themeId, page),
    queryFn: (): Promise<DevelopersPerPageData> => {
      return trpc.developer.getManyByTheme.query({
        page: page.toString(),
        themeId,
      });
    },
    keepPreviousData: true,
  });

  return { developersPerPage, ...others };
};
