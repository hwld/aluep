import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const developersQueryKey = ["themes"] as const;
export const paginatedDeveloperQueryKey = (page: number) => {
  const p = isNaN(page) ? 1 : page;
  return [...developersQueryKey, { page: p }] as const;
};

export const usePaginatedDeveloperQuery = (page: number) => {
  const result = useQuery({
    queryKey: paginatedDeveloperQueryKey(page),
    queryFn: ({ queryKey }) => {
      const { page } = queryKey[1];
      return trpc.theme.getDeveloperAllpage.query({ page: page.toString() });
    },
    keepPreviousData: true,
  });

  return result;
};
