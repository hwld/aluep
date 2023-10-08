import { ideaKeys } from "@/client/features/idea/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { ideaOrderSchema, ideaPeriodSchema } from "@/models/idea";
import { useQuery } from "@tanstack/react-query";

export type UseSearchedIdeasQueryArgs = {
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
    queryKey: ideaKeys.searchedList({
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

      return __trpc_old.idea.search.query({
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
