import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/notification";

type UseIdeaCommentsArgs = { ideaId: string };

export const useIdeaComments = ({ ideaId }: UseIdeaCommentsArgs) => {
  // 指定されたお題のコメントを取得する
  const { data: ideaComments } = trpc.ideaComment.getAll.useQuery(
    { ideaId },
    { keepPreviousData: true }
  );

  const postCommentMutation = trpc.ideaComment.create.useMutation({
    onError: () => {
      showErrorNotification({
        title: "お題へのコメント",
        message: "コメントを送信できませんでした。",
      });
    },
  });

  const deleteCommentMutation = trpc.ideaComment.delete.useMutation({
    onError: () => {
      showErrorNotification({
        title: "コメントの削除",
        message: "コメントを削除できませんでした。",
      });
    },
  });

  return { ideaComments, postCommentMutation, deleteCommentMutation };
};
