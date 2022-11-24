import { Avatar, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { Theme } from "../../../server/models/theme";
import { ThemeTagBadge } from "../ThemeTagBadge";
import { ThemeMenuButton } from "./ThemeMenuButton";

type Props = { theme: Theme };
export const ThemeCard: React.FC<Props> = ({ theme }) => {
  const router = useRouter();

  const handleGoDetail = () => {
    router.push(`/themes/${theme.id}`);
  };

  return (
    <Card
      key={theme.id}
      w={560}
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
            <Avatar
              src={theme.user.image}
              radius="xl"
              size="md"
              sx={(theme) => ({
                borderWidth: "2px",
                borderColor: theme.colors.gray[2],
                borderStyle: "solid",
                borderRadius: "100%",
              })}
            />
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
              <ThemeTagBadge size="lg" key={tag.id}>
                {tag.name}
              </ThemeTagBadge>
            );
          })}
        </Flex>
      </Stack>
    </Card>
  );
};
