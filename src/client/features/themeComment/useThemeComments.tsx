import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThemeCommentFormData } from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { themeQueryKey } from "../theme/useThemeQuery";

export const themeCommentsQueryKey = (themeId: string) =>
  [...themeQueryKey(themeId), "comments"] as const;

export const useThemeComments = (themeId: string) => {
  const queryClient = useQueryClient();

  // 指定されたお題のコメントを取得する
  const { data: themeComments } = useQuery({
    queryKey: themeCommentsQueryKey(themeId),
    queryFn: () => {
      return trpc.themeComment.getAllComments.query({ themeId });
    },
  });

  const postCommentMutation = useMutation({
    mutationFn: (data: OmitStrict<ThemeCommentFormData, "themeId">) => {
      return trpc.themeComment.comment.mutate({ ...data, themeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(themeCommentsQueryKey(themeId));
    },
    onError: () => {
      showErrorNotification({
        title: "お題へのコメント",
        message: "コメントを送信できませんでした。",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => {
      return trpc.themeComment.deleteComment.mutate({ commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(themeCommentsQueryKey(themeId));
    },
    onError: () => {
      showErrorNotification({
        title: "コメントの削除",
        message: "コメントを削除できませんでした。",
      });
    },
  });

  return { themeComments, postCommentMutation, deleteCommentMutation };
};
