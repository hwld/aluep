import { LikeDevelopmentIcon } from "@/client/features/development/LikeDevelopmentIcon";
import { LikeIdeaIcon } from "@/client/features/idea/LikeIdeaIcon";
import { ReceivedLikeCount } from "@/client/features/user/useReceivedLikeCountQuery";
import { Card, Flex, Stack, Text } from "@mantine/core";

type Props = { receivedLikeCount: ReceivedLikeCount; width?: number };
export const UserReceivedLikeCard: React.FC<Props> = ({
  receivedLikeCount,
  width,
}) => {
  return (
    <Card w={width} h="100%" px="xl" sx={{ flexShrink: 0 }}>
      <Text c="gray.5" fw="bold">
        貰ったいいね
      </Text>
      <Stack sx={{ flexShrink: 0 }} spacing="lg" mt="md">
        <Stack spacing={5}>
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
        <Stack spacing={5}>
          <Text size="sm" c="gray.5">
            開発者としてのいいね
          </Text>
          <Flex align="center" gap={10}>
            <LikeDevelopmentIcon size="lg" />
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
