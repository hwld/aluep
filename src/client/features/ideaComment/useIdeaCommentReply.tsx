import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/notification";

type UseIdeaCommentReplyArgs = {
  closeReplyForm: () => void;
  onSuccess?: () => void;
};
export const useIdeaCommentReply = ({ onSuccess }: UseIdeaCommentReplyArgs) => {
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
