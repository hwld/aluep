import { trpc } from "@/client/lib/trpc";
import { useMutationWithNotification } from "@/client/lib/notification";

type UseIdeaCommentsArgs = { ideaId: string };

export const useIdeaComments = ({ ideaId }: UseIdeaCommentsArgs) => {
  // 指定されたお題のコメントを取得する
  const { data: ideaComments } = trpc.ideaComment.getAll.useQuery(
    { ideaId },
    { keepPreviousData: true }
  );

  const postCommentMutation = useMutationWithNotification(
    trpc.ideaComment.create,
    {
      errorNotification: {
        title: "お題へのコメント",
        message: "コメントを送信できませんでした。",
      },
    }
  );

  const deleteCommentMutation = useMutationWithNotification(
    trpc.ideaComment.delete,
    {
      errorNotification: {
        title: "コメントの削除",
        message: "コメントを削除できませんでした。",
      },
    }
  );

  return { ideaComments, postCommentMutation, deleteCommentMutation };
};
