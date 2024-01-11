import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import { Routes } from "@/share/routes";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconFlag, IconPhoto } from "@tabler/icons-react";
import { User } from "next-auth";
import { ReportUserModal } from "@/client/features/report/ReportUserModal/ReportUserModal";
import { useMemo } from "react";
import { CardMenuButton } from "@/client/ui/CardMenuButton/CardMenuButton";

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

  const userLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}${Routes.user(user.id)}`;
  }, [user.id]);

  return (
    <>
      <AppMenu>
        <CardMenuButton />
        <AppMenuDropdown>
          {isOwner && (
            <>
              <AppMenuLinkItem
                leftSection={<IconPhoto />}
                href={Routes.userUploadedImages(user.id)}
              >
                アップロードした画像
              </AppMenuLinkItem>
              <AppMenuLinkItem
                leftSection={<IconEdit />}
                href={Routes.userEdit(user.id)}
              >
                ユーザー情報を編集する
              </AppMenuLinkItem>
              <AppMenuDivider />
            </>
          )}

          <AppMenuItem leftSection={<IconFlag />} onClick={openReportModal}>
            通報する
          </AppMenuItem>
        </AppMenuDropdown>
      </AppMenu>
      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        reportMeta={{
          targetUser: {
            url: userLink,
            name: user.name,
          },
        }}
      />
    </>
  );
};
