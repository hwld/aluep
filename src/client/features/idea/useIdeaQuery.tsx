import { ideaKeys } from "@/client/features/idea/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

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
