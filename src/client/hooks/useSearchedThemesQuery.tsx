import { useQuery } from "@tanstack/react-query";
import { themeOrderSchema } from "../../share/schema";
import { trpc } from "../trpc";

export const searchedThemesQueryKey = ({
  keyword,
  tagIds,
  order,
  page,
}: UseSearchedThemesQueryArgs) =>
  ["themes", { keyword, tagIds, order, page }] as const;

type UseSearchedThemesQueryArgs = {
  keyword: string;
  tagIds: string[];
  order: string;
  page: number;
};
export const useSearchedThemesQuery = ({
  keyword,
  tagIds,
  order: rawOrder,
  page,
}: UseSearchedThemesQueryArgs) => {
  const { data: searchedThemesResult, ...others } = useQuery({
    queryKey: searchedThemesQueryKey({
      keyword,
      tagIds,
      page,
      order: rawOrder,
    }),
    queryFn: ({ queryKey }) => {
      const { keyword, tagIds } = queryKey[1];

      const order = themeOrderSchema.parse(rawOrder);

      return trpc.theme.search.query({
        keyword,
        tagIds,
        order,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { searchedThemesResult, ...others };
};
