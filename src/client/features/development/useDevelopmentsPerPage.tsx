import { useQuery } from "@tanstack/react-query";
import { ThemeDevelopment } from "../../../server/models/themeDevelopment";
import { trpc } from "../../lib/trpc";
import { themeQueryKey } from "../theme/useThemeQuery";

export const developmentsPerPageQueryKey = (themeId: string, page: number) => {
  const p = isNaN(page) ? 1 : page;
  return [...themeQueryKey(themeId), "developments", { page: p }] as const;
};

export type DevelopmentsPerPageData = {
  list: ThemeDevelopment[];
  allPages: number;
};

export const useDevelopmentsPerPage = (themeId: string, page: number) => {
  const { data: developmentsPerPage, ...others } = useQuery({
    queryKey: developmentsPerPageQueryKey(themeId, page),
    queryFn: (): Promise<DevelopmentsPerPageData> => {
      return trpc.development.getManyByTheme.query({
        page: page.toString(),
        themeId,
      });
    },
    keepPreviousData: true,
  });

  return { developmentsPerPage, ...others };
};
