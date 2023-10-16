import { InProgresDevLinkList } from "@/client/features/dev/InProgresDevLinkList/InProgresDevLinkList";
import { trpc } from "@/client/lib/trpc";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { SidebarItem } from "@/client/ui/SidebarItem/SidebarItem";
import { useDisclosure } from "@mantine/hooks";
import { TbCode } from "react-icons/tb";

type Props = { tooltip?: boolean; loggedInUserId: string };

export const DevInProgresSidebarItem: React.FC<Props> = ({
  tooltip,
  loggedInUserId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: devs } = trpc.dev.getInProgresDevsByUser.useQuery(
    { userId: loggedInUserId },
    { initialData: [] }
  );

  return (
    <>
      <SidebarItem
        icon={TbCode}
        label="開発中のお題"
        tooltip={tooltip}
        onClick={open}
      />
      <AppModal
        size="lg"
        opened={opened}
        onClose={close}
        title="開発中のお題"
        styles={{ body: { padding: "8px 4px" } }}
      >
        <InProgresDevLinkList devs={devs} onCloseModal={close} />
      </AppModal>
    </>
  );
};
