import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/lib/trpc";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { ideaCommentKeys } from "./queryKeys";

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
