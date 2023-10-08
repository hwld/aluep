import { ideaKeys } from "@/client/features/idea/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

type UseIdeaQueryArgs = { ideaId: string };

export const useIdeaQuery = ({ ideaId }: UseIdeaQueryArgs) => {
  const { data: idea, ...others } = useQuery({
    queryKey: ideaKeys.detail(ideaId),
    queryFn: () => {
      return __trpc_old.idea.get.query({ ideaId: ideaId });
    },
  });

  return { idea, ...others };
};
