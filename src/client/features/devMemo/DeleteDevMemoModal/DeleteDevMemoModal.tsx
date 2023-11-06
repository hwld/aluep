import { useDevMemos } from "@/client/features/devMemo/useDevMemos";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { IconTrash } from "@tabler/icons-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  devId: string;
  devMemoId: string;
};

export const DeleteDevMemoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  devId,
  devMemoId,
}) => {
  const { deleteMemoMutation } = useDevMemos({ devId });
  const handleDeleteMemo = () => {
    deleteMemoMutation.mutate({ devMemoId });
  };

  return (
    <AppConfirmModal
      title="開発メモの削除"
      message={
        <>
          開発メモを削除してもよろしいですか？<br></br>
          開発メモを削除すると、もらった返信が完全に削除されます。
        </>
      }
      opened={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteMemo}
      isConfirming={deleteMemoMutation.isLoading}
      confirmIcon={IconTrash}
      confirmText="削除する"
    />
  );
};
