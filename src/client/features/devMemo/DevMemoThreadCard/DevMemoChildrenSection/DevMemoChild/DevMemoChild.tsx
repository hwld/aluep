import { DevMemoMenuButton } from "@/client/features/devMemo/DevMemoMenuButton/DevMemoMenuButton";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { AppLinkify } from "@/client/ui/AppLinkify/AppLinkify";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { DevMemo } from "@/models/devMemo";
import { Flex, Stack, Text } from "@mantine/core";
import classes from "./DevMemoChild.module.css";

type Props = { memo: DevMemo; devId: string };

export const DevMemoChild: React.FC<Props> = ({ memo, devId }) => {
  const { session } = useSessionQuery();
  const memoRef = useHashRemoverOnClickOutside({
    canRemove: (hash) => hash === memo.id,
  });

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
            <MutedText>{memo.fromUser.name}</MutedText>
            <Flex>
              <Text c="gray.7" size="xs">
                {formatDate(memo.createdAt)}
              </Text>
            </Flex>
          </Stack>
          <DevMemoMenuButton
            devId={devId}
            devMemoId={memo.id}
            isOwner={memo.fromUser.id === session?.user.id}
          />
        </Flex>
        <AppLinkify>
          <Text className={classes["text-wrapper"]}>{memo.text}</Text>
        </AppLinkify>
      </Stack>
    </Flex>
  );
};
