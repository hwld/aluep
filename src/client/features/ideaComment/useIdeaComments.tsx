import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IdeaCommentFormData } from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { ideaQueryKey } from "../idea/useIdeaQuery";

export const ideaCommentsQueryKey = (ideaId: string) =>
  [...ideaQueryKey(ideaId), "comments"] as const;

export const useIdeaComments = (ideaId: string) => {
  const queryClient = useQueryClient();

  // 指定されたお題のコメントを取得する
  const { data: ideaComments } = useQuery({
    queryKey: ideaCommentsQueryKey(ideaId),
    queryFn: () => {
      return trpc.ideaComment.getAll.query({ ideaId });
    },
  });

  const postCommentMutation = useMutation({
    mutationFn: (data: OmitStrict<IdeaCommentFormData, "ideaId">) => {
      return trpc.ideaComment.comment.mutate({ ...data, ideaId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(ideaCommentsQueryKey(ideaId));
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
      return trpc.ideaComment.delete.mutate({ commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(ideaCommentsQueryKey(ideaId));
    },
    onError: () => {
      showErrorNotification({
        title: "コメントの削除",
        message: "コメントを削除できませんでした。",
      });
    },
  });

  return { ideaComments, postCommentMutation, deleteCommentMutation };
};
