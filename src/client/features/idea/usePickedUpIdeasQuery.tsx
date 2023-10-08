import { ideaKeys } from "@/client/features/idea/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { IdeaOrder } from "@/models/idea";
import { useQuery } from "@tanstack/react-query";

export const usePickedUpIdeasQuery = (order: IdeaOrder) => {
  const { data: pickedUpIdeas, ...others } = useQuery({
    queryKey: ideaKeys.pickedUpList(order),
    queryFn: () => {
      return __trpc_old.aggregate.getPickedIdeas.query({ order });
    },
    //　古いとみなさない
    staleTime: Infinity,
  });

  return { pickedUpIdeas: pickedUpIdeas ?? [], ...others };
};
