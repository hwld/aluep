import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { Routes } from "@/share/routes";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";

type Props = { isOpen: boolean; onClose: () => void; ideaId: string };

export const DeleteIdeaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ideaId,
}) => {
  const router = useRouter();

  const deleteIdeaMutation = useMutationWithNotification(trpc.idea.delete, {
    succsesNotification: { title: "お題の削除", message: "お題を削除しました" },
    errorNotification: {
      title: "お題の削除",
      message: "お題を削除できませんでした。",
    },
    onSuccess: async () => {
      await router.replace(Routes.home);
      onClose();
    },
  });
  const handleDeleteIdea = () => {
    deleteIdeaMutation.mutate({ ideaId });
  };

  return (
    <AppConfirmModal
      title="お題の削除"
      message={
        <>
          お題を削除してもよろしいですか？
          <br />
          お題を削除すると、もらった「いいね」、他のユーザーの開発情報が完全に削除されます。
        </>
      }
      opened={isOpen}
      onClose={onClose}
      onConfirm={handleDeleteIdea}
      isConfirming={deleteIdeaMutation.isLoading}
      confirmIcon={IconTrash}
      confirmText="削除する"
    />
  );
};
