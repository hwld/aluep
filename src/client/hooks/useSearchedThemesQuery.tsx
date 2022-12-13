import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const searchedThemesQueryKey = ({
  keyword,
  tagIds,
  page,
}: UseSearchedThemesQueryArgs) =>
  ["themes", { keyword, tagIds, page }] as const;

type UseSearchedThemesQueryArgs = {
  keyword: string;
  tagIds: string[];
  page: number;
};
export const useSearchedThemesQuery = ({
  keyword,
  tagIds,
  page,
}: UseSearchedThemesQueryArgs) => {
  const { data: searchedThemesResult, ...others } = useQuery({
    queryKey: searchedThemesQueryKey({ keyword, tagIds, page }),
    queryFn: ({ queryKey }) => {
      const { keyword, tagIds } = queryKey[1];
      return trpc.theme.search.query({
        keyword,
        tagIds,
        page: page.toString(),
      });
    },
    keepPreviousData: true,
  });

  return { searchedThemesResult, ...others };
};
