import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/client/lib/utils";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { SvgFlag, SvgLink, SvgTrash } from "@/client/ui/Icons";
import { ReportBaseForm } from "@/models/report";
import { Routes } from "@/share/routes";
import { useClipboard, useDisclosure } from "@mantine/hooks";

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
                leftSection={<SvgTrash />}
              >
                コメントを削除する
              </AppMenuItem>
              <AppMenuDivider />
            </>
          )}
          <>
            <AppMenuItem leftSection={<SvgLink />} onClick={handleCopyLink}>
              リンクをコピーする
            </AppMenuItem>
            <AppMenuItem leftSection={<SvgFlag />} onClick={openReportModal}>
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
        confirmIcon={SvgTrash}
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
