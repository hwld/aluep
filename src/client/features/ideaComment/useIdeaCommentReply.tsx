import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IdeaCommentFormData } from "../../../share/schema";
import { OmitStrict } from "../../../types/OmitStrict";
import { trpc } from "../../lib/trpc";
import { showErrorNotification } from "../../lib/utils";
import { ideaCommentsQueryKey } from "./useIdeaComments";

type UseIdeaCommentReplyParams = {
  ideaId: string;
  closeReplyForm: () => void;
  onSuccess?: () => void;
};
export const useIdeaCommentReply = ({
  ideaId,
  onSuccess,
}: UseIdeaCommentReplyParams) => {
  const queryClient = useQueryClient();
  const replyMutation = useMutation({
    mutationFn: (data: OmitStrict<IdeaCommentFormData, "ideaId">) => {
      return trpc.ideaComment.comment.mutate({ ...data, ideaId });
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries(ideaCommentsQueryKey(ideaId));
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
