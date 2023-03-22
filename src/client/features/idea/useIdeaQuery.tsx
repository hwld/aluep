import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export const ideasQueryKey = ["ideas"] as const;
export const ideaQueryKey = (ideaId: string) =>
  [...ideasQueryKey, ideaId] as const;

export const useIdeaQuery = (ideaId: string) => {
  const { data: idea, ...others } = useQuery({
    queryKey: ideaQueryKey(ideaId),
    queryFn: () => {
      return trpc.idea.get.query({ ideaId: ideaId });
    },
  });

  return { idea, ...others };
};
