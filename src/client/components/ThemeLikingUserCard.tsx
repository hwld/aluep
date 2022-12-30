import { Card, Flex, Stack, Text } from "@mantine/core";
import { UserIconLink } from "./UserIconLink";

type Props = {
  userId: string;
  userImage?: string | null;
  userName?: string | null;
};
export function ThemeLikingUserCard({ userId, userImage, userName }: Props) {
  return (
    <Card
      w={560}
      sx={() => ({
        cursor: "pointer",
        position: "static",
      })}
    >
      <Stack spacing={10}>
        {/* ユーザー情報 */}
        <Flex align="center" justify="space-between">
          <Flex gap={10} align="flex-start">
            <UserIconLink userId={userId} imageSrc={userImage} />

            <Text>{userName}</Text>
          </Flex>
        </Flex>
      </Stack>
    </Card>
  );
}
