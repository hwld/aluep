import {
  Card,
  Divider,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { MdComputer } from "react-icons/md";
import { TbFileText, TbHeart } from "react-icons/tb";
import { UserActivity } from "../useUserActivityQuery";

type Props = { userActivity: UserActivity; width?: number };
export const UserActivityCard: React.FC<Props> = ({ userActivity, width }) => {
  const { colors } = useMantineTheme();

  return (
    <Card w={width} h="100%" px="xl" sx={{ flexShrink: 0 }}>
      <Text c="gray.5" fw="bold">
        アクティビティ
      </Text>
      <Stack mt="md">
        <Stack spacing={5}>
          <Text size="sm" c="gray.5">
            投稿したお題の数
          </Text>
          <Flex align="center" gap={10}>
            <TbFileText size={40} color={colors.red[7]} />
            <Flex align="flex-end" gap={2}>
              <Text size="md" fw="bold" c="red.7">
                {userActivity.postedIdeaCount}
              </Text>
              <Text size="xs">件</Text>
            </Flex>
          </Flex>
          <Divider color="red" size={3} />
        </Stack>
        <Stack spacing={5}>
          <Text size="sm" c="gray.5">
            開発したお題の数
          </Text>
          <Flex align="center" gap={10}>
            <MdComputer size={40} color={colors.blue[7]} />
            <Flex align="flex-end" gap={2}>
              <Text size="md" fw="bold" c="blue.7">
                {userActivity.developmentCount}
              </Text>
              <Text size="xs">件</Text>
            </Flex>
          </Flex>
          <Divider color="blue" size={3} />
        </Stack>
        <Stack spacing={5}>
          <Text size="sm" c="gray.5">
            いいねしたお題の数
          </Text>
          <Flex align="center" gap={10}>
            <TbHeart size={40} color={colors.pink[6]} />
            <Flex align="flex-end" gap={2}>
              <Text size="md" fw="bold" c="pink.6">
                {userActivity.likedIdeaCount}
              </Text>
              <Text size="xs">件</Text>
            </Flex>
          </Flex>
          <Divider color="pink" size={3} />
        </Stack>
      </Stack>
    </Card>
  );
};
