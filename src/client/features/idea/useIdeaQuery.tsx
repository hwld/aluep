import { trpc } from "@/client/lib/trpc";

type UseIdeaQueryArgs = { ideaId: string | undefined };

export const useIdeaQuery = ({ ideaId }: UseIdeaQueryArgs) => {
  const { data, ...others } = trpc.idea.get.useQuery(
    // enabledがあるから、実際に実行されるときにはstringになっているはず・・・
    { ideaId: ideaId! },
    { enabled: !!ideaId }
  );
  return { idea: data, ...others };
};
