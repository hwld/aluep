import { useDevMutations } from "@/client/features/dev/useDevMutations";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";

type Props = { dev: Dev; isOpen: boolean; onClose: () => void };

export const DeleteDevModal: React.FC<Props> = ({ dev, isOpen, onClose }) => {
  const router = useRouter();

  const { deleteDevMutation } = useDevMutations();
  const handleDeleteDev = async () => {
    deleteDevMutation.mutate(
      { devId: dev.id },
      {
        onSuccess: async () => {
          if (dev?.idea) {
            await router.replace(Routes.idea(dev.idea.id));
          } else {
            await router.replace(Routes.user(dev.developer.id));
          }

          onClose();
        },
      }
    );
  };

  return (
    <AppConfirmModal
      title="開発情報の削除"
      message={
        <>
          開発情報を削除してもよろしいですか？
          <br />
          開発情報を削除すると、もらった「いいね」の情報が完全に削除されます。
        </>
      }
      opened={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteDev}
      isConfirming={deleteDevMutation.isLoading}
      confirmIcon={IconTrash}
      confirmText="削除する"
    />
  );
};
