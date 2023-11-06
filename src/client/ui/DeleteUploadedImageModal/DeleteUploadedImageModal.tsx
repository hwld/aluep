import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { IconTrash } from "@tabler/icons-react";

type Props = { isOpen: boolean; onClose: () => void; imageUrl: string };

export const DeleteUploadedImageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  imageUrl,
}) => {
  const deleteMutation = useMutationWithNotification(
    trpc.uploadedImage.delete,
    {
      succsesNotification: {
        title: "画像の削除",
        message: "画像を削除しました",
      },
      errorNotification: {
        title: "画像の削除",
        message: "お題を削除できませんでした",
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate({ imageUrl });
  };

  return (
    <AppConfirmModal
      title="画像の削除"
      message={
        <>
          アップロードした画像を削除してもよろしいですか？
          <br />
          お題に画像が含まれている場合、正しく表示されなくなります。
        </>
      }
      opened={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      isConfirming={deleteMutation.isLoading}
      confirmIcon={IconTrash}
      confirmText="削除する"
    />
  );
};
