// TODO: 現在は全件取得をしているのでpagingを追加する

import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themesQueryKey = ["themes"];

export const useThemesQuery = () => {
  const { data: themes, ...others } = useQuery({
    queryKey: themesQueryKey,
    queryFn: () => {
      return trpc.theme.getAll.query();
    },
    initialData: [],
  });

  return { themes, ...others };
};
