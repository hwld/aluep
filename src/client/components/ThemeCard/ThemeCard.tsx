import {
  Box,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import { FaRegComment } from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { TbHeart } from "react-icons/tb";
import { Theme } from "../../../server/models/theme";
import { TextLink } from "../TextLink";
import { ThemeTagBadge } from "../ThemeTagBadge";
import { UserIconLink } from "../UserIconLink";

export const themeCardMinWidthPx = 450;

type Props = { theme: Theme };
export const ThemeCard: React.FC<Props> = ({ theme }) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();

  const handleGoThemeDetail = () => {
    router.push(`/themes/${theme.id}`);
  };

  return (
    <Card
      miw={themeCardMinWidthPx}
      w="100%"
      h="100%"
      sx={(theme) => ({
        cursor: "pointer",
        position: "static",
        transition: "all 150ms",
        // アイコン、タグバッジをホバーしたときにスタイルを当てたくないのでaria-label='user-icon'|'tag-badge'の要素を使っているが、
        // UserIcon, ThemeTagBadgeが変わったときにスタイルが当たらなくなりそう
        "&:not(:has(*[aria-label='user-icon']:hover,*[aria-label='tag-badge']:hover)):hover":
          {
            boxShadow: `${theme.shadows.lg}, 0 0 0 2px ${theme.colors.red[7]}`,
          },
      })}
      onClick={handleGoThemeDetail}
    >
      <Stack spacing={10} miw={0}>
        {/* ヘッダ */}
        <Flex justify="space-between" align="flex-start" gap={10} miw={0}>
          <TextLink href={`/themes/${theme.id}`}>
            <Title order={3} color="red.7" sx={{ lineHeight: 1.4 }}>
              {theme.title}
            </Title>
          </TextLink>
        </Flex>

        {/* ユーザー情報 */}
        <Flex gap={5} direction="column" miw={0}>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10 }}
          >
            <UserIconLink iconSrc={theme.user.image} userId={theme.user.id} />
            <Flex
              direction="column"
              justify="center"
              sx={{ overflow: "hidden" }}
              miw={0}
            >
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
              <Flex align="center" gap="lg">
                <Text color="gray.5" size="sm" sx={{ whiteSpace: "nowrap" }}>
                  {theme.elapsedSinceCreation}
                </Text>
                <Flex align="center" gap="sm">
                  <Flex align="center" gap={3}>
                    <TbHeart size="16px" color={mantineTheme.colors.red[7]} />
                    <Text size="xs" c="red.7">
                      {theme.likes}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={3}>
                    <MdComputer
                      size="15px"
                      color={mantineTheme.colors.red[7]}
                    />
                    <Text size="xs" c="red.7">
                      {theme.developers}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={3}>
                    <FaRegComment
                      size="15px"
                      color={mantineTheme.colors.red[7]}
                    />
                    <Text size="xs" c="red.7">
                      {theme.comments}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        {/* タグ */}
        <Flex gap={5} wrap="wrap" miw={0}>
          {theme.tags.map((tag) => {
            return (
              <ThemeTagBadge tagId={tag.id} size="md" key={tag.id}>
                {tag.name}
              </ThemeTagBadge>
            );
          })}
        </Flex>
      </Stack>
    </Card>
  );
};
