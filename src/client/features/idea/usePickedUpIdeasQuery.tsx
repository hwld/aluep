import { useQuery } from "@tanstack/react-query";
import { IdeaOrder } from "../../../share/schema";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "./queryKeys";

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
