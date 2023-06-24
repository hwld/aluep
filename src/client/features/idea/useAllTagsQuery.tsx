import { ideaKeys } from "@/client/features/idea/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { useQuery } from "@tanstack/react-query";

// すべてのタグってあんまり更新頻度高くないし、react-queryで管理しなくても良いかもしれない。
export const useAllTagsQuery = () => {
  const { data: allTags, ...others } = useQuery({
    queryKey: ideaKeys.allTags,
    queryFn: () => {
      return trpc.idea.getAllTags.query();
    },
    initialData: [],
  });

  return { allTags, ...others };
};
