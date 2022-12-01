import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const searchedThemesQueryKey = ({
  keyword,
  tagIds,
}: UseSearchedThemesQueryArgs) => ["themes", { keyword, tagIds }] as const;

type UseSearchedThemesQueryArgs = { keyword: string; tagIds: string[] };
export const useSearchedThemesQuery = ({
  keyword,
  tagIds,
}: UseSearchedThemesQueryArgs) => {
  const { data: searchedThemes, ...others } = useQuery({
    queryKey: searchedThemesQueryKey({ keyword, tagIds }),
    queryFn: ({ queryKey }) => {
      const { keyword, tagIds } = queryKey[1];
      return trpc.theme.search.query({
        keyword,
        tagIds,
      });
    },
  });

  return { searchedThemes, ...others };
};
