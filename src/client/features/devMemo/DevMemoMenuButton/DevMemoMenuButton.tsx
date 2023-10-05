import { ReportForm } from "@/client/features/report/ReportForm/ReportForm";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
  stopPropagation,
} from "@/client/lib/utils";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu/AppMenu";
import { AppMenuDropdown } from "@/client/ui/AppMenu/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenu/AppMenuItem/AppMenuItem";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { ReportBaseForm } from "@/models/report";
import { RouterInputs } from "@/server/lib/trpc";
import { Routes } from "@/share/routes";
import { ActionIcon, Divider, Menu } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { BiTrashAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import { TbLink } from "react-icons/tb";
import classes from "./DevMemoMenuButton.module.css";

type Props = {
  ideaId: string;
  developmentId: string;
  developmentMemoId: string;
  /** ログインしているユーザーのプロフィールかどうか */
  isOwner: boolean;
  onDeleteMemo: (id: string) => void;
  isDeleting?: boolean;
};
export const DevMemoMenuButton: React.FC<Props> = ({
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
            color="transparent"
            c="gray.7"
            className={classes.trigger}
            onClick={stopPropagation}
          >
            <BsThreeDots size="70%" />
          </ActionIcon>
        </Menu.Target>

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
          onSubmit={handleSubmitReportDevelopmentMemo}
          onCancel={closeReportModal}
          isLoading={false}
        />
      </AppModal>
    </>
  );
};
