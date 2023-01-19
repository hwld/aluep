import { useMutation, useQuery } from "@tanstack/react-query";
import { ThemeCommentFormData } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { trpc } from "../trpc";
import { themeQueryKey } from "./useThemeQuery";

const themeCommentsQueryKey = (themeId: string) =>
  [...themeQueryKey(themeId), "comments"] as const;

export const useThemeComments = (themeId: string) => {
  // 指定されたお題のコメントを取得する
  const { data: themeComments } = useQuery({
    queryKey: themeCommentsQueryKey(themeId),
    queryFn: () => {
      return trpc.theme.getManyComments.query({ themeId });
    },
  });

  const postCommentMutation = useMutation({
    mutationFn: (data: ThemeCommentFormData) => {
      return trpc.theme.comment.mutate(data);
    },
  });

  // コメントを投稿する関数
  const postComment = (data: OmitStrict<ThemeCommentFormData, "themeId">) => {
    postCommentMutation.mutate({ ...data, themeId });
  };

  return { themeComments, postComment };
};
