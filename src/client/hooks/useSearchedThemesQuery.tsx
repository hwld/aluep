import { useQuery } from "@tanstack/react-query";
import { themeOrderSchema, themePeriodSchema } from "../../share/schema";
import { trpc } from "../trpc";

export const searchedThemesQueryKey = ({
  keyword,
  tagIds,
  order,
  page,
  period,
}: UseSearchedThemesQueryArgs) =>
  ["themes", { keyword, tagIds, order, period, page }] as const;

type UseSearchedThemesQueryArgs = {
  keyword: string;
  tagIds: string[];
  order: string;
  period: string;
  page: number;
};
export const useSearchedThemesQuery = ({
  keyword,
  tagIds,
  order: rawOrder,
  period: rawPeriod,
  page,
}: UseSearchedThemesQueryArgs) => {
  const { data: searchedThemesResult, ...others } = useQuery({
    queryKey: searchedThemesQueryKey({
      keyword,
      tagIds,
      page,
      order: rawOrder,
      period: rawPeriod,
    }),
    queryFn: ({ queryKey }) => {
      const { keyword, tagIds } = queryKey[1];

      const order = themeOrderSchema.parse(rawOrder);
      const period = themePeriodSchema.parse(rawPeriod);

      return trpc.theme.search.query({
        keyword,
        tagIds,
        order,
        period,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { searchedThemesResult, ...others };
};
