import { ideaCommentKeys } from "@/client/features/ideaComment/queryKeys";
import { __trpc_old } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { RouterInputs } from "@/server/lib/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UseIdeaCommentsArgs = { ideaId: string };

export const useIdeaComments = ({ ideaId }: UseIdeaCommentsArgs) => {
  const queryClient = useQueryClient();

  // 指定されたお題のコメントを取得する
  const { data: ideaComments } = useQuery({
    queryKey: ideaCommentKeys.listByIdea(ideaId),
    queryFn: () => {
      return __trpc_old.ideaComment.getAll.query({ ideaId });
    },
    keepPreviousData: true,
  });

  const postCommentMutation = useMutation({
    mutationFn: (data: RouterInputs["ideaComment"]["create"]) => {
      return __trpc_old.ideaComment.create.mutate(data);
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
      return __trpc_old.ideaComment.delete.mutate({ commentId });
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
