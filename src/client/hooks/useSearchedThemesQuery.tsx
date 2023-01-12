import { useQuery } from "@tanstack/react-query";
import { ThemeOrder } from "../../share/schema";
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
  order: ThemeOrder;
  page: number;
};
export const useSearchedThemesQuery = ({
  keyword,
  tagIds,
  order,
  page,
}: UseSearchedThemesQueryArgs) => {
  const { data: searchedThemesResult, ...others } = useQuery({
    queryKey: searchedThemesQueryKey({ keyword, tagIds, page, order }),
    queryFn: ({ queryKey }) => {
      const { keyword, tagIds } = queryKey[1];
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
