import { Avatar, Badge, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { Theme } from "../../../server/models/theme";
import { ThemeMenuButton } from "./ThemeMenuButton";

type Props = { theme: Theme };
export const ThemeCard: React.FC<Props> = ({ theme }) => {
  const router = useRouter();

  const handleGoDetail = () => {
    router.push(`/themes/${theme.id}`);
  };

  return (
    <Card
      radius="md"
      shadow="md"
      key={theme.id}
      bg="gray.01"
      w={480}
      sx={() => ({
        cursor: "pointer",
        position: "static",
      })}
      onClick={handleGoDetail}
    >
      <Stack spacing={10}>
        {/* ヘッダ */}
        <Flex justify="space-between" align="flex-start" gap={10}>
          <Title order={3} color="red.7" sx={{ lineHeight: 1.2 }}>
            {theme.title}
          </Title>
          <ThemeMenuButton theme={theme} />
        </Flex>

        {/* ユーザー情報 */}
        <Flex align="center" justify="space-between">
          <Flex gap={10} align="flex-start">
            <Avatar src={theme.user.image} radius="xl" size="md" />
            <Text>{theme.user.name}</Text>
          </Flex>
          <Text color="gray.5">
            {new Date(theme.createdAt).toLocaleString()}
          </Text>
        </Flex>

        {/* タグ */}
        <Flex gap={5} wrap="wrap">
          {theme.tags.map((tag) => {
            return (
              <Badge
                size="lg"
                sx={(theme) => ({
                  textTransform: "none",
                  backgroundColor: theme.fn.rgba(theme.colors.red[7], 0.1),
                  color: theme.colors.red[7],
                })}
                key={tag.id}
              >
                {tag.name}
              </Badge>
            );
          })}
        </Flex>
      </Stack>
    </Card>
  );
};
