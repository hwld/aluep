import { ideaCommentKeys } from "@/client/features/ideaComment/queryKeys";
import { trpc } from "@/client/lib/trpc";
import { showErrorNotification } from "@/client/lib/utils";
import { RouterInputs } from "@/server/lib/trpc";
import { useQueryClient, useMutation } from "@tanstack/react-query";

type UseIdeaCommentReplyArgs = {
  ideaId: string;
  closeReplyForm: () => void;
  onSuccess?: () => void;
};
export const useIdeaCommentReply = ({
  ideaId,
  onSuccess,
}: UseIdeaCommentReplyArgs) => {
  const queryClient = useQueryClient();
  const replyMutation = useMutation({
    mutationFn: (data: RouterInputs["ideaComment"]["create"]) => {
      return trpc.ideaComment.create.mutate(data);
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries(ideaCommentKeys.listByIdea(ideaId));
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
