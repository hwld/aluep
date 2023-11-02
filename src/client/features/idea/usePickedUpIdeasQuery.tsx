import { trpc } from "@/client/lib/trpc";
import { IdeaOrder } from "@/models/idea";

export const usePickedUpIdeasQuery = (order: IdeaOrder) => {
  const { data: pickedUpIdeas, ...others } =
    trpc.aggregate.getPickedIdeas.useQuery(
      { order },
      //　古いとみなさない
      { staleTime: Infinity }
    );

  return { pickedUpIdeas: pickedUpIdeas, ...others };
};
