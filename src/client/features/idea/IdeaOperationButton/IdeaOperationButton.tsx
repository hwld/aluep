import { AppMenu } from "@/client/ui/AppMenu/AppMenu";
import { AppMenuDivider } from "@/client/ui/AppMenuDivider/AppMenuDivider";
import { AppMenuDropdown } from "@/client/ui/AppMenuDropdown";
import { AppMenuItem } from "@/client/ui/AppMenuItem/AppMenuItem";
import { AppMenuLinkItem } from "@/client/ui/AppMenuLinkItem/AppMenuLinkItem";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconEdit, IconFlag, IconTrash } from "@tabler/icons-react";
import classes from "./IdeaOperationButton.module.css";
import { ReportIdeaModal } from "@/client/features/report/ReportIdeaModal/ReportIdeaModal";
import { useMemo } from "react";
import { DeleteIdeaModal } from "@/client/features/idea/DeleteIdeaModal/DeleteIdeaModal";

type Props = { idea: Idea; isIdeaOwner: boolean };
export const IdeaOperationButton: React.FC<Props> = ({ idea, isIdeaOwner }) => {
  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [
    isReportModalOpen,
    { open: openReportModal, close: closeReportModal },
  ] = useDisclosure(false);

  const ideaLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}${Routes.idea(idea.id)}`;
  }, [idea.id]);

  return (
    <>
      <AppMenu position="bottom-start">
        <Menu.Target>
          <ActionIcon size={35} className={classes.icon}>
            <IconDots
              width="70%"
              height="70%"
              color="var(--mantine-color-gray-5)"
            />
          </ActionIcon>
        </Menu.Target>
        <AppMenuDropdown>
          {isIdeaOwner && (
            <>
              <AppMenuLinkItem
                leftSection={<IconEdit />}
                href={Routes.ideaEdit(idea.id)}
              >
                お題を編集する
              </AppMenuLinkItem>
              <AppMenuItem
                leftSection={<IconTrash />}
                red
                onClick={openDeleteModal}
              >
                お題を削除する
              </AppMenuItem>

              <AppMenuDivider />
            </>
          )}
          <AppMenuItem leftSection={<IconFlag />} onClick={openReportModal}>
            通報する
          </AppMenuItem>
        </AppMenuDropdown>
      </AppMenu>

      <DeleteIdeaModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        ideaId={idea.id}
      />
      <ReportIdeaModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        reportMeta={{
          targetIdea: {
            url: ideaLink,
            title: idea.title,
          },
        }}
      />
    </>
  );
};
