import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import { useMutationWithNotification } from "@/client/lib/notification";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { ReportBaseForm } from "@/models/report";
import { Routes } from "@/share/routes";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconFlag, IconLink, IconTrash } from "@tabler/icons-react";

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

  const reportIdeaCommentMutation = useMutationWithNotification(
    trpc.report.ideaComment,
    {
      succsesNotification: {
        title: "コメントの通報",
        message: "コメントを通報しました。",
      },
      errorNotification: {
        title: "コメントの通報",
        message: "コメントを通報できませんでした。",
      },
      onSuccess: () => {
        closeReportModal();
      },
    }
  );

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
                leftSection={<IconTrash />}
              >
                コメントを削除する
              </AppMenuItem>
              <AppMenuDivider />
            </>
          )}
          <>
            <AppMenuItem leftSection={<IconLink />} onClick={handleCopyLink}>
              リンクをコピーする
            </AppMenuItem>
            <AppMenuItem leftSection={<IconFlag />} onClick={openReportModal}>
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
        confirmIcon={IconTrash}
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
