import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "./queryKeys";

type UseIdeaQueryArgs = { ideaId: string };

export const useIdeaQuery = ({ ideaId }: UseIdeaQueryArgs) => {
  const { data: idea, ...others } = useQuery({
    queryKey: ideaKeys.detail(ideaId),
    queryFn: () => {
      return trpc.idea.get.query({ ideaId: ideaId });
    },
  });

  return { idea, ...others };
};
