import { ideaCommentKeys } from "@/client/features/ideaComment/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { RouterInputs } from "@/server/lib/trpc";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

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
    mutationFn: (data: RouterInputs["ideaComment"]["create"]) => {
      return trpc.ideaComment.create.mutate(data);
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
