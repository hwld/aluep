import { useDevMutations } from "@/client/features/dev/useDevMutations";
import { AppConfirmModal } from "@/client/ui/AppConfirmModal/AppConfirmModal";
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
import router from "next/router";
import { ReportDev } from "@/client/features/report/ReportDev/ReportDev";
import { useMemo } from "react";

type Props = { dev: Dev; isOwner: boolean };

// TODO: delete関係をコンポーネントに分けたい
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

  const { deleteDevMutation } = useDevMutations();
  const handleDeleteDev = async () => {
    deleteDevMutation.mutate(
      { devId: dev.id },
      {
        onSuccess: async () => {
          if (dev?.idea) {
            await router.replace(Routes.idea(dev.idea.id));
          } else {
            await router.replace(Routes.user(dev.developer.id));
          }

          closeDeleteModal();
        },
      }
    );
  };

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
      <AppConfirmModal
        title="開発情報の削除"
        message={
          <>
            開発情報を削除してもよろしいですか？
            <br />
            開発情報を削除すると、もらった「いいね」の情報が完全に削除されます。
          </>
        }
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteDev}
        isConfirming={deleteDevMutation.isLoading}
        confirmIcon={IconTrash}
        confirmText="削除する"
      />
      <ReportDev
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
