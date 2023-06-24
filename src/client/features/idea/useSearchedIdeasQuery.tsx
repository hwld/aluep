import { useQuery } from "@tanstack/react-query";
import { ideaOrderSchema, ideaPeriodSchema } from "../../../share/schema/idea";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "./queryKeys";

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
