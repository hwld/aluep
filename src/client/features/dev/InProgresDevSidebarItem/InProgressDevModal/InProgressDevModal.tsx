import { InProgresDevLinkList } from "@/client/features/dev/InProgresDevSidebarItem/InProgressDevModal/InProgresDevLinkList/InProgresDevLinkList";
import { trpc } from "@/client/lib/trpc";
import { AppModal } from "@/client/ui/AppModal/AppModal";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Routes } from "@/share/routes";
import { Center, Text } from "@mantine/core";
import { IconCode } from "@tabler/icons-react";

type Props = { isOpen: boolean; onClose: () => void; loggedInUserId: string };

export const InProgressDevModal: React.FC<Props> = ({
  isOpen,
  onClose,
  loggedInUserId,
}) => {
  const { data: devs } = trpc.dev.getInProgresDevsByUser.useQuery(
    { userId: loggedInUserId },
    { initialData: [] }
  );

  return (
    <AppModal
      size="lg"
      opened={isOpen}
      onClose={onClose}
      title="開発中のお題"
      styles={{
        body: { padding: "var(--mantine-spacing-md)", minHeight: "300px" },
      }}
    >
      {devs.length > 0 ? (
        <InProgresDevLinkList devs={devs} onCloseModal={onClose} />
      ) : (
        <Center mt="xl">
          <EmptyContentItem
            icon={
              <IconCode
                width={100}
                height={100}
                color="var(--mantine-color-red-7)"
              />
            }
            description={
              <>
                気になるアプリを検索してみましょう。<br></br>
                アプリの検索は
                <TextLink
                  wrapperStyle={{ display: "inline" }}
                  href={Routes.ideaSearch()}
                  onClick={onClose}
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
  );
};
