import { LikeDevIcon } from "@/client/features/dev/LikeDevIcon/LikeDevIcon";
import { LikeIdeaIcon } from "@/client/features/idea/LikeIdeaIcon/LikeIdeaIcon";
import { ReceivedLikeCount } from "@/client/features/user/useReceivedLikeCountQuery";
import { Card, Flex, Stack, Text } from "@mantine/core";

type Props = { receivedLikeCount: ReceivedLikeCount; width?: number };
export const UserReceivedLikeCard: React.FC<Props> = ({
  receivedLikeCount,
  width,
}) => {
  return (
    <Card w={width} h="100%" px="xl" style={{ flexShrink: 0 }}>
      <Text c="gray.5" fw="bold">
        貰ったいいね
      </Text>
      <Stack style={{ flexShrink: 0 }} gap="lg" mt="md">
        <Stack gap={5}>
          <Text size="sm" c="gray.5">
            投稿者としてのいいね
          </Text>
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
          <Text size="sm" c="gray.5">
            開発者としてのいいね
          </Text>
          <Flex align="center" gap={10}>
            <LikeDevIcon size="lg" />
            <Flex align="flex-end" gap={2}>
              <Text size="xl" fw="bold" c="red.7">
                {receivedLikeCount.developmentLikeCount}
              </Text>
              <Text size="sm">likes</Text>
            </Flex>
          </Flex>
        </Stack>
      </Stack>
    </Card>
  );
};
