import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { Routes } from "@/share/routes";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconFlag, IconLink, IconTrash } from "@tabler/icons-react";
import { ReportIdeaComment } from "@/client/features/report/ReportIdeaComment/ReportIdeaComment";
import { useMemo } from "react";

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

  const ideaCommentLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}${Routes.idea(ideaId)}#${commentId}`;
  }, [commentId, ideaId]);

  const handleCopyLink = () => {
    clipboard.copy(ideaCommentLink);
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
      <ReportIdeaComment
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        reportMeta={{ targetCommentUrl: ideaCommentLink }}
      />
    </>
  );
};
