import { ActionIcon, Divider, Menu } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { BiTrashAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import { TbLink } from "react-icons/tb";
import { RouterInputs } from "../../../server/lib/trpc";
import { Routes } from "../../../share/routes";
import { ReportBaseForm } from "../../../share/schema/report";
import { trpc } from "../../lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
  stopPropagation,
} from "../../lib/utils";
import { AppConfirmModal } from "../../ui/AppConfirmModal";
import { AppMenu } from "../../ui/AppMenu/AppMenu";
import { MenuDropdown } from "../../ui/AppMenu/MenuDropdown";
import { MenuItem } from "../../ui/AppMenu/MenuItem";
import { AppModal } from "../../ui/AppModal";
import { ReportForm } from "../report/ReportForm";

type Props = {
  ideaId: string;
  developmentId: string;
  developmentMemoId: string;
  /** ログインしているユーザーのプロフィールかどうか */
  isOwner: boolean;
  onDeleteMemo: (id: string) => void;
  isDeleting?: boolean;
};
export const DevelopmentMemoMenuButton: React.FC<Props> = ({
  ideaId,
  developmentId,
  isOwner,
  developmentMemoId,
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
    onDeleteMemo(developmentMemoId);
  };

  const reportDevelopmentMemoMutation = useMutation({
    mutationFn: (data: RouterInputs["report"]["developmentMemo"]) => {
      return trpc.report.developmentMemo.mutate(data);
    },
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
    return `${window.location.origin}${Routes.development(
      ideaId,
      developmentId
    )}#${developmentMemoId}`;
  };

  const handleSubmitReportDevelopmentMemo = (data: ReportBaseForm) => {
    reportDevelopmentMemoMutation.mutate({
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
        <Menu.Target>
          <ActionIcon
            size={35}
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
                icon={<FaTrash size={18} />}
                red
                onClick={openDeleteModal}
              >
                メモを削除する
              </MenuItem>
              <Divider my={5} />
            </>
          )}
          <MenuItem icon={<TbLink size={20} />} onClick={handleCopyLink}>
            リンクをコピーする
          </MenuItem>
          <MenuItem icon={<MdFlag size={18} />} onClick={openReportModal}>
            通報する
          </MenuItem>
        </MenuDropdown>
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
          onSubmit={handleSubmitReportDevelopmentMemo}
          onCancel={closeReportModal}
          isLoading={false}
        />
      </AppModal>
    </>
  );
};
