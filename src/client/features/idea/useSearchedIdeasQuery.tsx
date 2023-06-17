import { useQuery } from "@tanstack/react-query";
import { ideaOrderSchema, ideaPeriodSchema } from "../../../share/schema";
import { trpc } from "../../lib/trpc";

export const searchedIdeasQueryKey = ({
  keyword,
  tagIds,
  order,
  page,
  period,
}: UseSearchedIdeasQueryArgs) =>
  ["ideas", { keyword, tagIds, order, period, page }] as const;

type UseSearchedIdeasQueryArgs = {
  keyword: string;
  tagIds: string[];
  order: string;
  period: string;
  page: number;
};
export const useSearchedIdeasQuery = ({
  keyword,
  tagIds,
  order: rawOrder,
  period: rawPeriod,
  page,
}: UseSearchedIdeasQueryArgs) => {
  const { data: searchedIdeasResult, ...others } = useQuery({
    queryKey: searchedIdeasQueryKey({
      keyword,
      tagIds,
      page,
      order: rawOrder,
      period: rawPeriod,
    }),
    queryFn: ({ queryKey }) => {
      const { keyword, tagIds } = queryKey[1];

      const order = ideaOrderSchema.parse(rawOrder);
      const period = ideaPeriodSchema.parse(rawPeriod);

      return trpc.idea.search.query({
        keyword,
        tagIds,
        order,
        period,
        page,
      });
    },
    keepPreviousData: true,
  });

  return { searchedIdeasResult, ...others };
};
