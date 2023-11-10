import { InProgressDevModal } from "@/client/features/dev/InProgressDevModal/InProgressDevModal";
import { SidebarItem } from "@/client/ui/SidebarItem/SidebarItem";
import { useDisclosure } from "@mantine/hooks";
import { IconCode } from "@tabler/icons-react";

type Props = { tooltip?: boolean; loggedInUserId: string };

export const InProgresDevSidebarItem: React.FC<Props> = ({
  tooltip,
  loggedInUserId,
}) => {
  const [isOpen, { open, close }] = useDisclosure(false);

  return (
    <>
      <SidebarItem
        icon={IconCode}
        label="開発中のお題"
        tooltip={tooltip}
        onClick={open}
      />
      <InProgressDevModal
        isOpen={isOpen}
        onClose={close}
        loggedInUserId={loggedInUserId}
      />
    </>
  );
};
