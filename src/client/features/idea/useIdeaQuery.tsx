import { trpc } from "@/client/lib/trpc";

type UseIdeaQueryArgs = { ideaId: string };

export const useIdeaQuery = ({ ideaId }: UseIdeaQueryArgs) => {
  const { data, ...others } = trpc.idea.get.useQuery({ ideaId });
  return { idea: data, ...others };
};
