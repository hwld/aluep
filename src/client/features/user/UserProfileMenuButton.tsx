import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { BsThreeDots } from "react-icons/bs";
import { MdFlag } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { RouterInputs } from "../../../server/lib/trpc";
import { User } from "../../../server/models/user";
import { Routes } from "../../../share/routes";
import { ReportBaseForm } from "../../../share/schema";
import { trpc } from "../../lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
  stopPropagation,
} from "../../lib/utils";
import { AppMenu } from "../../ui/AppMenu/AppMenu";
import { MenuDropdown } from "../../ui/AppMenu/MenuDropdown";
import { MenuItem } from "../../ui/AppMenu/MenuItem";
import { MenuLinkItem } from "../../ui/AppMenu/MenuLinkItem";
import { AppModal } from "../../ui/AppModal";
import { ReportForm } from "../report/ReportForm";

type Props = {
  user: User;
  /** ログインしているユーザーのプロフィールかどうか */
  isOwner: boolean;
};
export const UserProfileMenuButton: React.FC<Props> = ({ user, isOwner }) => {
  const [
    isReportModalOpen,
    { close: closeReportModal, open: openReportModal },
  ] = useDisclosure(false);

  const reportUserMutation = useMutation({
    mutationFn: (data: RouterInputs["report"]["user"]) => {
      return trpc.report.user.mutate(data);
    },
    onSuccess: () => {
      showSuccessNotification({
        title: "ユーザーの通報",
        message: "ユーザーを通報しました。",
      });
      closeReportModal();
    },
    onError: () => {
      showErrorNotification({
        title: "ユーザーの通報",
        message: "ユーザーを通報できませんでした。",
      });
    },
  });

  const handleSubmitReportUser = (data: ReportBaseForm) => {
    reportUserMutation.mutate({
      reportDetail: data.reportDetail,
      targetUser: {
        url: `${window.location.origin}${Routes.user(user.id)}`,
        name: user.name,
      },
    });
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
          <MenuItem icon={<MdFlag size={18} />} onClick={openReportModal}>
            通報する
          </MenuItem>
          {isOwner && (
            <MenuLinkItem
              icon={<RiEdit2Line size={18} />}
              href={Routes.userUpdate}
            >
              プロフィールを編集する
            </MenuLinkItem>
          )}
        </MenuDropdown>
      </AppMenu>
      <AppModal
        opened={isReportModalOpen}
        onClose={closeReportModal}
        title="ユーザーの通報"
      >
        <ReportForm
          submitText="ユーザーを通報する"
          onSubmit={handleSubmitReportUser}
          onCancel={closeReportModal}
          isLoading={reportUserMutation.isLoading}
        />
      </AppModal>
    </>
  );
};
