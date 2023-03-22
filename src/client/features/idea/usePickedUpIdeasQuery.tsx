import { useQuery } from "@tanstack/react-query";
import { IdeaOrder } from "../../../share/schema";
import { trpc } from "../../lib/trpc";

export const pickedUpIdeasQueryKey = (order: IdeaOrder) =>
  ["ideas", "pickedUp", order] as const;

export const usePickedUpIdeasQuery = (order: IdeaOrder) => {
  const { data: pickedUpIdeas, ...others } = useQuery({
    queryKey: pickedUpIdeasQueryKey(order),
    queryFn: () => {
      return trpc.aggregate.getPickedIdeas.query({ order });
    },
    //　古いとみなさない
    staleTime: Infinity,
  });

  return { pickedUpIdeas: pickedUpIdeas ?? [], ...others };
};
