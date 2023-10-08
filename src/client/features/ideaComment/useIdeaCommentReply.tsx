import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";

type UseIdeaCommentReplyArgs = {
  ideaId: string;
  closeReplyForm: () => void;
  onSuccess?: () => void;
};
export const useIdeaCommentReply = ({
  ideaId,
  onSuccess,
}: UseIdeaCommentReplyArgs) => {
  const utils = trpc.useContext();

  const replyMutation = trpc.ideaComment.create.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      showErrorNotification({
        title: "お題への返信",
        message: "お題に返信できませんでした。",
      });
    },
  });

  return { replyMutation };
};
