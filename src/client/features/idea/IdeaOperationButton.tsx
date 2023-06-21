import { ActionIcon, Divider, Menu, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { BiTrashAlt } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { RouterInputs } from "../../../server/lib/trpc";
import { Idea } from "../../../server/models/idea";
import { Routes } from "../../../share/routes";
import { ReportBaseForm } from "../../../share/schema";
import { trpc } from "../../lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../lib/utils";
import { AppConfirmModal } from "../../ui/AppConfirmModal";
import { AppMenu } from "../../ui/AppMenu/AppMenu";
import { MenuDropdown } from "../../ui/AppMenu/MenuDropdown";
import { MenuItem } from "../../ui/AppMenu/MenuItem";
import { MenuLinkItem } from "../../ui/AppMenu/MenuLinkItem";
import { AppModal } from "../../ui/AppModal";
import { ReportForm } from "../report/ReportForm";

type Props = { idea: Idea; isIdeaOwner: boolean };
export const IdeaOperationButton: React.FC<Props> = ({ idea, isIdeaOwner }) => {
  const mantineTheme = useMantineTheme();
  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [
    isReportModalOpen,
    { open: openReportModal, close: closeReportModal },
  ] = useDisclosure(false);
  const router = useRouter();

  // お題の削除
  const deleteIdeaMutation = useMutation({
    mutationFn: () => {
      return trpc.idea.delete.mutate({ ideaId: idea.id });
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "お題の削除",
        message: "お題を削除しました",
      });
      closeDeleteModal();
      router.push(Routes.home);
    },
    onError: () => {
      showErrorNotification({
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const handleDeleteIdea = () => {
    deleteIdeaMutation.mutate();
  };

  // お題の通報
  const reportIdeaMutation = useMutation({
    mutationFn: (data: RouterInputs["report"]["idea"]) => {
      return trpc.report.idea.mutate(data);
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "お題の通報",
        message: "お題を通報しました。",
      });
      closeReportModal();
    },
    onError: () => {
      showErrorNotification({
        title: "お題の通報",
        message: "お題を通報できませんでした。",
      });
    },
  });

  const handleSubmitReportIdea = (data: ReportBaseForm) => {
    reportIdeaMutation.mutate({
      reportDetail: data.reportDetail,
      targetIdea: {
        url: `${window.location.origin}${Routes.idea(idea.id)}`,
        title: idea.title,
      },
    });
  };

  return (
    <>
      <AppMenu position="bottom-start">
        <Menu.Target>
          <ActionIcon
            size={35}
            sx={(theme) => ({
              borderRadius: "50%",
              boxShadow: theme.shadows.md,
              transition: "all 100ms",
              backgroundColor: theme.colors.gray[1],
              outline: "transparent solid 0px",
              "&:hover": {
                outline: `${theme.colors.red[6]} solid 2px`,
                outlineOffset: "2px",
              },
            })}
          >
            <BsThreeDots size="70%" color={mantineTheme.colors.gray[5]} />
          </ActionIcon>
        </Menu.Target>
        <MenuDropdown>
          {isIdeaOwner && (
            <>
              <MenuLinkItem
                icon={<RiEdit2Fill size={20} />}
                href={Routes.ideaUpdate(idea.id)}
              >
                お題を編集する
              </MenuLinkItem>
              <MenuItem
                icon={<FaTrash size={18} />}
                red
                onClick={openDeleteModal}
              >
                お題を削除する
              </MenuItem>

              <Divider my={5} />
            </>
          )}
          <MenuItem icon={<MdFlag size={18} />} onClick={openReportModal}>
            通報する
          </MenuItem>
        </MenuDropdown>
      </AppMenu>
      <AppConfirmModal
        title="お題の削除"
        message={
          <>
            お題を削除してもよろしいですか？
            <br />
            お題を削除すると、もらった「いいね」、他のユーザーの開発情報が完全に削除されます。
          </>
        }
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteIdea}
        isConfirming={deleteIdeaMutation.isLoading}
        confirmIcon={BiTrashAlt}
        confirmText="削除する"
      />
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="お題の通報"
      >
        <ReportForm
          submitText="お題を通報する"
          onSubmit={handleSubmitReportIdea}
          onCancel={closeReportModal}
          isLoading={reportIdeaMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
