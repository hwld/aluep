import { ideaKeys } from "@/client/features/idea/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { IdeaOrder } from "@/share/schema/idea";
import { useQuery } from "@tanstack/react-query";

export const usePickedUpIdeasQuery = (order: IdeaOrder) => {
  const { data: pickedUpIdeas, ...others } = useQuery({
    queryKey: ideaKeys.pickedUpList(order),
    queryFn: () => {
      return trpc.aggregate.getPickedIdeas.query({ order });
    },
    //　古いとみなさない
    staleTime: Infinity,
  });

  return { pickedUpIdeas: pickedUpIdeas ?? [], ...others };
};
