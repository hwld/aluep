import { trpc } from "@/client/lib/trpc";
import { IdeaOrder, IdeaPeriod } from "@/models/idea";

export type UseSearchedIdeasQueryArgs = {
  keyword: string;
  tagIds: string[];
  order: IdeaOrder;
  period: IdeaPeriod;
  page: number;
};

export const useSearchedIdeasQuery = (args: UseSearchedIdeasQueryArgs) => {
  const { data: searchedIdeasResult, ...others } = trpc.idea.search.useQuery(
    args,
    { keepPreviousData: true }
  );

  return { searchedIdeasResult, ...others };
};
