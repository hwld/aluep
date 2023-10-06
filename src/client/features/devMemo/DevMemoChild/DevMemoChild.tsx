import { DevMemoMenuButton } from "@/client/features/devMemo/DevMemoMenuButton/DevMemoMenuButton";
import { useDevMemos } from "@/client/features/devMemo/useDevMemos";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { DevelopmentMemo } from "@/models/developmentMemo";
import { Flex, Stack, Text } from "@mantine/core";
import classes from "./DevMemoChild.module.css";

type Props = { memo: DevelopmentMemo; developmentId: string; ideaId: string };

export const DevMemoChild: React.FC<Props> = ({
  memo,
  developmentId,
  ideaId,
}) => {
  const { session } = useSessionQuery();
  const { deleteMemoMutation } = useDevMemos({ developmentId });
  const memoRef = useHashRemoverOnClickOutside({
    canRemove: (hash) => hash === memo.id,
  });

  const handleDeleteMemo = (id: string) => {
    deleteMemoMutation.mutate({ developmentMemoId: id });
  };

  return (
    <Flex ref={memoRef} id={memo.id} gap="xs" className={classes.root}>
      <Stack>
        <UserIconLink
          userId={memo.fromUser.id}
          iconSrc={memo.fromUser.imageUrl}
        />
      </Stack>
      <Stack gap="md" className={classes.content}>
        <Flex justify="space-between">
          <Stack gap={0}>
            <Text c="gray.5" size="xs">
              {memo.fromUser.name}
            </Text>
            <Flex>
              <Text c="gray.7" size="xs">
                {formatDate(memo.createdAt)}
              </Text>
            </Flex>
          </Stack>
          <DevMemoMenuButton
            ideaId={ideaId}
            developmentId={developmentId}
            developmentMemoId={memo.id}
            isOwner={memo.fromUser.id === session?.user.id}
            onDeleteMemo={handleDeleteMemo}
            isDeleting={deleteMemoMutation.isLoading}
          />
        </Flex>
        <Text className={classes["text-wrapper"]}>{memo.text}</Text>
      </Stack>
    </Flex>
  );
};
