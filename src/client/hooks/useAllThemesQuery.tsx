import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { themesQueryKey } from "./usePaginatedThemesQuery";

export const useAllThemesQuery = () => {
  const { data: allThemes, ...others } = useQuery({
    queryKey: themesQueryKey,
    queryFn: () => {
      return trpc.theme.getAll.query();
    },
  });

  return { allThemes, ...others };
};
