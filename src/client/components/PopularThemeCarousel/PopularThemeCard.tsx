import { Avatar, Box, Card, Flex, Stack, Text, Title } from "@mantine/core";
import { format } from "date-fns";
import Link from "next/link";
import { Theme } from "../../../server/models/theme";

export const popularThemeCardWidthPx = 400;
export const PopularThemeCard: React.FC<{ theme: Theme }> = ({ theme }) => {
  return (
    <Box
      component={Link}
      href={`/themes/${theme.id}`}
      sx={(theme) => ({ textDecoration: "none" })}
    >
      <Card
        key={theme.id}
        miw={popularThemeCardWidthPx}
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
      >
        <Stack spacing={10} justify="space-between" h="100%">
          {/* ヘッダ */}
          <Flex justify="space-between" align="flex-start" gap={10}>
            <Title
              order={4}
              color="red.7"
              sx={{
                lineHeight: 1.2,
              }}
            >
              {theme.title}
            </Title>
          </Flex>

          {/* ユーザー情報 */}
          <Flex gap={5} direction="column">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 10,
              }}
            >
              <Avatar
                src={theme.user.image}
                radius="xl"
                size="sm"
                sx={(theme) => ({
                  borderWidth: "2px",
                  borderColor: theme.colors.gray[2],
                  borderStyle: "solid",
                  borderRadius: "100%",
                  flexShrink: 0,
                })}
              />
              <Flex direction="column">
                <Text
                  size="xs"
                  sx={{
                    flexShrink: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {theme.user.name}
                </Text>
                <Text color="gray.5" size="xs" sx={{ whiteSpace: "nowrap" }}>
                  {format(new Date(theme.createdAt), "yyyy年M月d日")}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Stack>
      </Card>
    </Box>
  );
};
