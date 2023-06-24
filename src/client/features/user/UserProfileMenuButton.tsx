import { ReportForm } from "@/client/features/report/ReportForm";
import { trpc } from "@/client/lib/trpc";
import {
  showErrorNotification,
  showSuccessNotification,
  stopPropagation,
} from "@/client/lib/utils";
import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { MenuDropdown } from "@/client/ui/AppMenu/MenuDropdown";
import { MenuItem } from "@/client/ui/AppMenu/MenuItem";
import { MenuLinkItem } from "@/client/ui/AppMenu/MenuLinkItem";
import { AppModal } from "@/client/ui/AppModal";
import { ReportBaseForm } from "@/models/report";
import { RouterInputs } from "@/server/lib/trpc";
import { Routes } from "@/share/routes";
import { ActionIcon, Divider, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { User } from "next-auth";
import { BsThreeDots } from "react-icons/bs";
import { MdFlag } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";

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
          {isOwner && (
            <>
              <MenuLinkItem
                icon={<RiEdit2Line size={18} />}
                href={Routes.userUpdate}
              >
                プロフィールを編集する
              </MenuLinkItem>
              <Divider my={5} />
            </>
          )}

          <MenuItem icon={<MdFlag size={18} />} onClick={openReportModal}>
            通報する
          </MenuItem>
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
