import { trpc } from "@/client/lib/trpc";

// すべてのタグってあんまり更新頻度高くないし、react-queryで管理しなくても良いかもしれない。
export const useAllTagsQuery = () => {
  const { data: allTags, ...others } = trpc.idea.getAllTags.useQuery(
    undefined,
    { initialData: [] }
  );

  return { allTags, ...others };
};
