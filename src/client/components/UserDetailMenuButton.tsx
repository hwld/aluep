import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { BsThreeDots } from "react-icons/bs";
import { MdFlag } from "react-icons/md";
import { RouterInputs } from "../../server/trpc";
import { Routes } from "../../share/routes";
import { ReportBaseForm } from "../../share/schema";
import { trpc } from "../trpc";
import {
  showErrorNotification,
  showSuccessNotification,
  stopPropagation,
} from "../utils";
import { AppMenu } from "./AppMenu/AppMenu";
import { MenuDropdown } from "./AppMenu/MenuDropdown";
import { MenuItem } from "./AppMenu/MenuItem";
import { AppModal } from "./AppModal";
import { ReportForm } from "./ReportForm";

type Props = { user: User };
export const UserDetailMenuButton: React.FC<Props> = ({ user }) => {
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
        url: `${window.location.origin}/${Routes.user(user.id)}`,
        name: user.name,
      },
    });
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
