import { InProgresDevLinkList } from "@/client/features/dev/InProgresDevLinkList/InProgresDevLinkList";
import { trpc } from "@/client/lib/trpc";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { SidebarItem } from "@/client/ui/SidebarItem/SidebarItem";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Routes } from "@/share/routes";
import { Center, Text } from "@mantine/core";
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
        styles={{ body: { padding: "8px 4px", minHeight: "300px" } }}
      >
        {devs.length > 0 ? (
          <InProgresDevLinkList devs={devs} onCloseModal={close} />
        ) : (
          <Center mt="xl">
            <EmptyContentItem
              icon={<TbCode size={100} color="var(--mantine-color-red-7)" />}
              description={
                <>
                  気になるアプリを検索してみましょう。<br></br>
                  アプリの検索は
                  <TextLink
                    wrapperStyle={{ display: "inline" }}
                    href={Routes.ideaSearch()}
                    onClick={close}
                  >
                    <Text c="red.7">こちら</Text>
                  </TextLink>
                  からどうぞ！
                </>
              }
              text="開発中のお題がありません"
            />
          </Center>
        )}
      </AppModal>
    </>
  );
};
