import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { Routes } from "@/share/routes";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { IconFlag, IconLink, IconTrash } from "@tabler/icons-react";
import { ReportDevMemoModal } from "@/client/features/report/ReportDevMemoModal/ReportDevMemoModal";
import { useMemo } from "react";
import { DeleteDevMemoModal } from "@/client/features/devMemo/DeleteDevMemoModal/DeleteDevMemoModal";

type Props = {
  devId: string;
  devMemoId: string;
  /** ログインしているユーザーのプロフィールかどうか */
  isOwner: boolean;
};
export const DevMemoMenuButton: React.FC<Props> = ({
  devId,
  isOwner,
  devMemoId,
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

  const devMemoLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}${Routes.dev(devId)}#${devMemoId}`;
  }, [devId, devMemoId]);

  const handleCopyLink = () => {
    clipboard.copy(devMemoLink);
  };

  return (
    <>
      <AppMenu>
        <AppMenuButton />

        <AppMenuDropdown>
          {isOwner && (
            <>
              <AppMenuItem
                leftSection={<IconTrash />}
                red
                onClick={openDeleteModal}
              >
                メモを削除する
              </AppMenuItem>
              <AppMenuDivider />
            </>
          )}
          <AppMenuItem leftSection={<IconLink />} onClick={handleCopyLink}>
            リンクをコピーする
          </AppMenuItem>
          <AppMenuItem leftSection={<IconFlag />} onClick={openReportModal}>
            通報する
          </AppMenuItem>
        </AppMenuDropdown>
      </AppMenu>
      <DeleteDevMemoModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        devId={devId}
        devMemoId={devMemoId}
      />
      <ReportDevMemoModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        reportMeta={{ targetMemoUrl: devMemoLink }}
      />
    </>
  );
};
