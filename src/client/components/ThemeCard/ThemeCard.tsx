import { Avatar, Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { Theme } from "../../../server/models/theme";
import { ThemeTagBadge } from "../ThemeTagBadge";
import { ThemeMenuButton } from "./ThemeMenuButton";

export const themeCardMinWidthPx = 450;

type Props = { theme: Theme };
export const ThemeCard: React.FC<Props> = ({ theme }) => {
  const router = useRouter();

  const handleGoDetail = () => {
    router.push(`/themes/${theme.id}`);
  };

  return (
    <Card
      key={theme.id}
      miw={themeCardMinWidthPx}
      w="100%"
      h="100%"
      sx={(theme) => ({
        cursor: "pointer",
        position: "static",
        transition: "all 150ms",
        "&:hover": {
          boxShadow: `${theme.shadows.lg}, 0 0 0 2px ${theme.colors.red[7]}`,
        },
      })}
      onClick={handleGoDetail}
    >
      <Stack spacing={10} miw={0}>
        {/* ヘッダ */}
        <Flex justify="space-between" align="flex-start" gap={10} miw={0}>
          <Title order={3} color="red.7" sx={{ lineHeight: 1.2 }}>
            {theme.title}
          </Title>
          <ThemeMenuButton theme={theme} />
        </Flex>

        {/* ユーザー情報 */}
        <Flex gap={5} direction="column" miw={0}>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10 }}
          >
            <Avatar
              src={theme.user.image}
              radius="xl"
              size="md"
              sx={(theme) => ({
                borderWidth: "2px",
                borderColor: theme.colors.gray[2],
                borderStyle: "solid",
                borderRadius: "100%",
                flexShrink: 0,
              })}
            />
            <Flex direction="column" sx={{ overflow: "hidden" }} miw={0}>
              <Text
                size="sm"
                sx={{
                  flexShrink: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {theme.user.name}
              </Text>
              <Text color="gray.5" size="sm" sx={{ whiteSpace: "nowrap" }}>
                {format(new Date(theme.createdAt), "yyyy年M月d日")}
              </Text>
            </Flex>
          </Box>
        </Flex>

        {/* タグ */}
        <Flex gap={5} wrap="wrap" miw={0}>
          {theme.tags.map((tag) => {
            return (
              <ThemeTagBadge size="md" key={tag.id}>
                {tag.name}
              </ThemeTagBadge>
            );
          })}
        </Flex>
      </Stack>
    </Card>
  );
};
