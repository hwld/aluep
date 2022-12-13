import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const allTagsQueryKey = ["allTags"];

// すべてのタグってあんまり更新頻度高くないし、react-queryで管理しなくても良いかもしれない。
export const useAllTagsQuery = () => {
  const { data: allTags, ...others } = useQuery(
    ["allTags"],
    () => {
      return trpc.theme.getAllTags.query();
    },
    { initialData: [] }
  );

  return { allTags, ...others };
};