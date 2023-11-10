import { LikeDevIcon } from "@/client/features/dev/LikeDevIcon/LikeDevIcon";
import { LikeIdeaIcon } from "@/client/features/idea/LikeIdeaIcon/LikeIdeaIcon";
import { ReceivedLikeCount } from "@/client/features/user/useReceivedLikeCountQuery";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { Card, Flex, Stack, Text } from "@mantine/core";

type Props = { receivedLikeCount: ReceivedLikeCount; width?: number };
export const UserReceivedLikeCard: React.FC<Props> = ({
  receivedLikeCount,
  width,
}) => {
  return (
    <Card w={width} h="100%" px="xl" style={{ flexShrink: 0 }}>
      <Text fw="bold">貰ったいいね</Text>
      <Stack style={{ flexShrink: 0 }} gap="lg" mt="md">
        <Stack gap={5}>
          <MutedText>投稿者としてのいいね</MutedText>
          <Flex align="center" gap={10}>
            <LikeIdeaIcon size="lg" />
            <Flex align="flex-end" gap={2}>
              <Text size="xl" fw="bold" c="red.7">
                {receivedLikeCount.ideaLikeCount}
              </Text>
              <Text size="sm">likes</Text>
            </Flex>
          </Flex>
        </Stack>
        <Stack gap={5}>
          <MutedText>開発者としてのいいね</MutedText>
          <Flex align="center" gap={10}>
            <LikeDevIcon size="lg" />
            <Flex align="flex-end" gap={2}>
              <Text size="xl" fw="bold" c="red.7">
                {receivedLikeCount.devLikeCount}
              </Text>
              <Text size="sm">likes</Text>
            </Flex>
          </Flex>
        </Stack>
      </Stack>
    </Card>
  );
};
