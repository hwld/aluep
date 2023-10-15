import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { ReportBaseForm } from "@/models/report";
import { Routes } from "@/share/routes";
import { Divider } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { BiTrashAlt } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import { TbLink } from "react-icons/tb";

type Props = {
  ideaId: string;
  devId: string;
  devMemoId: string;
  /** ログインしているユーザーのプロフィールかどうか */
  isOwner: boolean;
  onDeleteMemo: (id: string) => void;
  isDeleting?: boolean;
};
export const DevMemoMenuButton: React.FC<Props> = ({
  ideaId,
  devId,
  isOwner,
  devMemoId,
  onDeleteMemo,
  isDeleting = false,
}) => {
  const clipboard = useClipboard();

  const [
    isOpenDeleteModal,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const [
    isReportModalOpen,
    { close: closeReportModal, open: openReportModal },
  ] = useDisclosure(false);

  const handleDeleteMemo = () => {
    onDeleteMemo(devMemoId);
  };

  const reportDevMemoMutation = trpc.report.devMemo.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        title: "開発メモの通報",
        message: "開発メモを通報しました。",
      });
      closeReportModal();
    },
    onError: () => {
      showErrorNotification({
        title: "開発メモの通報",
        message: "開発メモを通報できませんでした。",
      });
    },
  });

  const buildLink = () => {
    return `${window.location.origin}${Routes.dev(ideaId, devId)}#${devMemoId}`;
  };

  const handleSubmitReportDevMemo = (data: ReportBaseForm) => {
    reportDevMemoMutation.mutate({
      reportDetail: data.reportDetail,
      targetMemoUrl: buildLink(),
    });
  };

  const handleCopyLink = () => {
    clipboard.copy(buildLink());
  };

  return (
    <>
      <AppMenu>
        <AppMenuButton />

        <AppMenuDropdown>
          {isOwner && (
            <>
              <AppMenuItem
                leftSection={<FaTrash size={18} />}
                red
                onClick={openDeleteModal}
              >
                メモを削除する
              </AppMenuItem>
              <Divider my={5} />
            </>
          )}
          <AppMenuItem
            leftSection={<TbLink size={20} />}
            onClick={handleCopyLink}
          >
            リンクをコピーする
          </AppMenuItem>
          <AppMenuItem
            leftSection={<MdFlag size={18} />}
            onClick={openReportModal}
          >
            通報する
          </AppMenuItem>
        </AppMenuDropdown>
      </AppMenu>
      <AppConfirmModal
        title="開発メモの削除"
        message={
          <>
            開発メモを削除してもよろしいですか？<br></br>
            開発メモを削除すると、もらった返信が完全に削除されます。
          </>
        }
        opened={isOpenDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteMemo}
        isConfirming={isDeleting}
        confirmIcon={BiTrashAlt}
        confirmText="削除する"
      />
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="開発メモの通報"
      >
        <ReportForm
          submitText="開発メモを通報する"
          onSubmit={handleSubmitReportDevMemo}
          onCancel={closeReportModal}
          isLoading={false}
        />
      </AppModal>
    </>
  );
};
