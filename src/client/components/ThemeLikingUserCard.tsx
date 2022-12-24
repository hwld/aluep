import { Avatar, Card, Flex, Stack, Text } from "@mantine/core";

type Props = {
  userImage?: string | null;
  userName?: string | null;
};
function ThemeLikingUserCard({ userImage, userName }: Props) {
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
            <Avatar
              src={userImage}
              radius="xl"
              size="md"
              sx={(theme) => ({
                borderWidth: "2px",
                borderColor: theme.colors.gray[2],
                borderStyle: "solid",
                borderRadius: "100%",
              })}
            />
            <Text>{userName}</Text>
          </Flex>
        </Flex>
      </Stack>
    </Card>
  );
}

export default ThemeLikingUserCard;
