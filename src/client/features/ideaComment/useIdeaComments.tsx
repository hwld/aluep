import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IdeaCommentFormData } from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { ideaCommentKeys } from "./queryKeys";

type UseIdeaCommentsArgs = { ideaId: string };

export const useIdeaComments = ({ ideaId }: UseIdeaCommentsArgs) => {
  const queryClient = useQueryClient();

  // 指定されたお題のコメントを取得する
  const { data: ideaComments } = useQuery({
    queryKey: ideaCommentKeys.listByIdea(ideaId),
    queryFn: () => {
      return trpc.ideaComment.getAll.query({ ideaId });
    },
    keepPreviousData: true,
  });

  const postCommentMutation = useMutation({
    mutationFn: (data: OmitStrict<IdeaCommentFormData, "ideaId">) => {
      return trpc.ideaComment.create.mutate({ ...data, ideaId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(ideaCommentKeys.listByIdea(ideaId));
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
      queryClient.invalidateQueries(ideaCommentKeys.listByIdea(ideaId));
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
