import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenu/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenu/AppMenuItem/AppMenuItem";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { ReportBaseForm } from "@/models/report";
import { Routes } from "@/share/routes";
import { Divider } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { BiTrashAlt } from "react-icons/bi";
import { MdFlag } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { TbLink } from "react-icons/tb";

type Props = {
  ideaId: string;
  commentId: string;
  onDeleteComment: () => void;
  isDeleting: boolean;
  isOwner: boolean;
};
export const IdeaCommentMenuButton: React.FC<Props> = ({
  ideaId,
  commentId,
  onDeleteComment,
  isDeleting,
  isOwner,
}) => {
  const clipboard = useClipboard();

  const [
    isDeleteModalOpen,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const [
    isReportModalOpen,
    { close: closeReportModal, open: openReportModal },
  ] = useDisclosure(false);

  const reportIdeaCommentMutation = trpc.report.ideaComment.useMutation({
    onSuccess: () => {
      showSuccessNotification({
        title: "コメントの通報",
        message: "コメントを通報しました。",
      });
      closeReportModal();
    },
    onError: () => {
      showErrorNotification({
        title: "コメントの通報",
        message: "コメントを通報できませんでした。",
      });
    },
  });

  const buildLink = () => {
    return `${window.location.origin}${Routes.idea(ideaId)}#${commentId}`;
  };

  const handleSubmitReportIdeaComment = (data: ReportBaseForm) => {
    reportIdeaCommentMutation.mutate({
      reportDetail: data.reportDetail,
      targetCommentUrl: buildLink(),
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
                red
                onClick={openDeleteModal}
                leftSection={<RiEdit2Fill size={20} />}
              >
                コメントを削除する
              </AppMenuItem>
              <Divider my="5px" />
            </>
          )}
          <>
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
          </>
        </AppMenuDropdown>
      </AppMenu>
      <AppConfirmModal
        title="コメントの削除"
        message={<>コメントを削除してもよろしいですか？</>}
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={onDeleteComment}
        isConfirming={isDeleting}
        confirmIcon={BiTrashAlt}
        confirmText="削除する"
      />
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="コメントの通報"
      >
        <ReportForm
          submitText="コメントを通報する"
          onSubmit={handleSubmitReportIdeaComment}
          onCancel={closeReportModal}
          isLoading={reportIdeaCommentMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
