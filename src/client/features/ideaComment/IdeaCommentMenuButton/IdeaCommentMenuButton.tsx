import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { Routes } from "@/share/routes";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconFlag, IconLink, IconTrash } from "@tabler/icons-react";
import { ReportIdeaCommentModal } from "@/client/features/report/ReportIdeaCommentModal/ReportIdeaCommentModal";
import { useMemo } from "react";
import { DeleteIdeaCommentModal } from "@/client/features/ideaComment/DeleteIdeaCommentModal/DeleteIdeaCommentModal";

type Props = {
  ideaId: string;
  commentId: string;
  isOwner: boolean;
};
export const IdeaCommentMenuButton: React.FC<Props> = ({
  ideaId,
  commentId,
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
      <DeleteIdeaCommentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        commentId={commentId}
        ideaId={ideaId}
      />
      <ReportIdeaCommentModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        reportMeta={{ targetCommentUrl: ideaCommentLink }}
      />
    </>
  );
};
