import { useQuery } from "@tanstack/react-query";
import { ThemeOrder } from "../../share/schema";
import { trpc } from "../trpc";

export const pickedUpThemesQueryKey = (order: ThemeOrder) =>
  ["themes", "pickedUp", order] as const;

export const usePickedUpThemesQuery = (order: ThemeOrder) => {
  const { data: pickedUpThemes, ...others } = useQuery({
    queryKey: pickedUpThemesQueryKey(order),
    queryFn: () => {
      return trpc.theme.pickUp.query({ order });
    },
    //　古いとみなさない
    staleTime: Infinity,
  });

  return { pickedUpThemes: pickedUpThemes ?? [], ...others };
};
