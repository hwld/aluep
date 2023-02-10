import { ActionIcon, Divider, Menu } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { BiTrashAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { MdFlag } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { TbLink } from "react-icons/tb";
import { RouterInputs } from "../../server/trpc";
import { Routes } from "../../share/routes";
import { ReportBaseForm } from "../../share/schema";
import { trpc } from "../trpc";
import {
  showErrorNotification,
  showSuccessNotification,
  stopPropagation,
} from "../utils";
import { AppConfirmModal } from "./AppConfirmModal";
import { AppMenu } from "./AppMenu/AppMenu";
import { MenuDropdown } from "./AppMenu/MenuDropdown";
import { MenuItem } from "./AppMenu/MenuItem";
import { AppModal } from "./AppModal";
import { ReportForm } from "./ReportForm";

type Props = {
  themeId: string;
  commentId: string;
  onDeleteComment: () => void;
  isDeleting: boolean;
  isOwner: boolean;
};
export const ThemeCommentMenuButton: React.FC<Props> = ({
  themeId,
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

  const reportThemeCommentMutation = useMutation({
    mutationFn: (data: RouterInputs["report"]["themeComment"]) => {
      return trpc.report.themeComment.mutate(data);
    },
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

  const handleSubmitReportThemeComment = (data: ReportBaseForm) => {
    reportThemeCommentMutation.mutate({
      reportDetail: data.reportDetail,
      targetCommentUrl: `${window.location.origin}/${Routes.theme(
        themeId
      )}#${commentId}`,
    });
  };

  const handleCopyLink = () => {
    clipboard.copy(
      `${window.location.origin}/${Routes.theme(themeId)}#${commentId}`
    );
  };

  return (
    <>
      <AppMenu>
        <Menu.Target>
          <ActionIcon
            size={30}
            color="gray"
            sx={(theme) => ({
              transition: "all 150ms",
              "&:hover": {
                backgroundColor: theme.fn.rgba(theme.colors.gray[5], 0.1),
              },
            })}
            onClick={stopPropagation}
          >
            <BsThreeDots size="70%" />
          </ActionIcon>
        </Menu.Target>

        <MenuDropdown>
          {isOwner && (
            <>
              <MenuItem
                red
                onClick={openDeleteModal}
                icon={<RiEdit2Fill size={20} />}
              >
                コメントを削除する
              </MenuItem>
              <Divider my="5px" />
            </>
          )}
          <>
            <MenuItem icon={<TbLink size={20} />} onClick={handleCopyLink}>
              リンクをコピーする
            </MenuItem>
            <MenuItem icon={<MdFlag size={18} />} onClick={openReportModal}>
              通報する
            </MenuItem>
          </>
        </MenuDropdown>
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
          onSubmit={handleSubmitReportThemeComment}
          onCancel={closeReportModal}
          isLoading={reportThemeCommentMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
