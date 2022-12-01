import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themesQueryKey = ["themes"] as const;
export const paginatedThemesQueryKey = (page: number) => {
  const p = isNaN(page) ? 1 : page;
  return [...themesQueryKey, { page: p }] as const;
};

export const usePaginatedThemesQuery = (page: number) => {
  const result = useQuery({
    queryKey: paginatedThemesQueryKey(page),
    queryFn: ({ queryKey }) => {
      const { page } = queryKey[1];
      return trpc.theme.getMany.query({ page: page.toString() });
    },
    keepPreviousData: true,
  });

  return result;
};
