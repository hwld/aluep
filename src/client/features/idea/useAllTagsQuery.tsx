import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "./queryKeys";

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
