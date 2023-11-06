import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuButton } from "@/client/ui/AppMenuButton/AppMenuButton";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconFlag, IconTrash } from "@tabler/icons-react";
import { ReportDevModal } from "@/client/features/report/ReportDevModal/ReportDevModal";
import { useMemo } from "react";
import { DeleteDevModal } from "@/client/features/dev/DeleteDevModal/DeleteDevModal";

type Props = { dev: Dev; isOwner: boolean };

export const DevMenuButton: React.FC<Props> = ({ dev, isOwner }) => {
  const [
    isDeleteModalOpen,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const [
    isReportModalOpen,
    { close: closeReportModal, open: openReportModal },
  ] = useDisclosure(false);

  const devLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}${Routes.dev(dev.id)}`;
  }, [dev.id]);

  return (
    <>
      <AppMenu>
        <AppMenuButton />

        <AppMenuDropdown>
          {isOwner && (
            <>
              <AppMenuLinkItem
                leftSection={<IconEdit />}
                href={Routes.devEdit(dev.id)}
              >
                開発情報を編集する
              </AppMenuLinkItem>
              <AppMenuItem
                red
                leftSection={<IconTrash />}
                onClick={openDeleteModal}
              >
                開発情報を削除する
              </AppMenuItem>
              <AppMenuDivider />
            </>
          )}
          <AppMenuItem leftSection={<IconFlag />} onClick={openReportModal}>
            通報する
          </AppMenuItem>
        </AppMenuDropdown>
      </AppMenu>
      <DeleteDevModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        dev={dev}
      />
      <ReportDevModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        reportMeta={{
          targetDeveloepr: {
            url: devLink,
            name: dev.developer.name,
          },
        }}
      />
    </>
  );
};
