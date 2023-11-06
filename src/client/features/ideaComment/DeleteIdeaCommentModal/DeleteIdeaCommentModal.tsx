import { useIdeaComments } from "@/client/features/ideaComment/useIdeaComments";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { IconTrash } from "@tabler/icons-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  commentId: string;
};

export const DeleteIdeaCommentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ideaId,
  commentId,
}) => {
  // お題のコメント操作
  const { deleteCommentMutation } = useIdeaComments({ ideaId });

  const handleDeleteComment = () => {
    deleteCommentMutation.mutate({ commentId });
  };

  return (
    <AppConfirmModal
      title="コメントの削除"
      message={<>コメントを削除してもよろしいですか？</>}
      opened={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteComment}
      isConfirming={deleteCommentMutation.isLoading}
      confirmIcon={IconTrash}
      confirmText="削除する"
    />
  );
};
