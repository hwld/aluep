import {
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { Theme } from "../../server/models/theme";
import { usePaginatedDeveloperQuery } from "../hooks/usePaginatedDeveloperQueery";
import { usePaginationState } from "../hooks/usePaginationState";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeDevelopersQuery } from "../hooks/useThemeDevelopersQuery";
import { useThemeJoin } from "../hooks/useThemeJoin";
import { useThemeLike } from "../hooks/useThemeLike";
import { appHeaderHeightPx } from "./AppHeader/AppHeader";
import { AppPagination } from "./AppPagination";
import { ThemeDeveloperCard } from "./DeveloperCard/ThemeDeveloperCard";
import { ThemeLikeButton } from "./ThemeLikeButton";
import { ThemeTagBadge } from "./ThemeTagBadge";
import { UserIconLink } from "./UserIconLink";

type Props = { theme: Theme };

export const ThemeDetailPage: React.FC<Props> = ({ theme }) => {
  const [page, setPage] = usePaginationState({});
  const mantineTheme = useMantineTheme();

  const { session } = useSessionQuery();
  const { likeThemeMutation, likedByLoggedInUser } = useThemeLike(theme.id);
  const {
    data: { joined },
  } = useThemeJoin(theme.id);

  const { likeDeveloperMutation } = useThemeDevelopersQuery(theme.id);

  const handleLikeTheme = () => {
    likeThemeMutation.mutate({
      themeId: theme.id,
      like: !likedByLoggedInUser,
    });
  };
  const { data } = usePaginatedDeveloperQuery(theme.id, page);

  // ログインしていて、テーマの投稿者と異なればいいねができる
  const canLike = Boolean(session && theme.user.id !== session.user.id);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Title align="center">{theme.title}</Title>
      <Flex mt="xl" gap="lg" w="100%">
        {/* いいねボタン */}
        <Flex
          direction="column"
          align="center"
          gap="xs"
          h="min-content"
          sx={{ position: "sticky", top: appHeaderHeightPx + 10 }}
        >
          <ThemeLikeButton
            likes={theme.likes}
            likedByLoggedInUser={likedByLoggedInUser}
            onClick={handleLikeTheme}
            disabled={!canLike}
          />
          <Button
            component={Link}
            href={`/themes/${theme?.id}/liking-users`}
            sx={(theme) => ({
              transition: "all 250ms",
              textDecoration: "underline",
              "&:hover": { backgroundColor: theme.fn.rgba(theme.black, 0.1) },
            })}
            variant="subtle"
          >
            いいね一覧
          </Button>
        </Flex>

        {/* 説明 */}
        <Box sx={{ flexGrow: 1 }}>
          <Card mih={300}>
            <Flex gap={10} mb={10} wrap="wrap">
              {theme.tags.map((tag) => (
                <ThemeTagBadge key={tag.id}>{tag.name}</ThemeTagBadge>
              ))}
            </Flex>
            <Text>{theme.description}</Text>
          </Card>
          <Button
            mt={15}
            component={Link}
            href={`/themes/${theme.id}/join`}
            replace
            disabled={joined}
            sx={(theme) => ({
              "&[data-disabled]": {
                backgroundColor: theme.colors.gray[3],
                color: theme.colors.gray[7],
              },
            })}
          >
            {joined ? "参加しています" : "参加する"}
          </Button>
          <Stack>
            <Title mt={30} order={4}>
              参加している開発者
            </Title>
            <Box
              sx={(theme) => ({
                display: "grid",
                gap: theme.spacing.md,
              })}
            >
              {data?.developers.map((developer) => {
                return (
                  <ThemeDeveloperCard
                    key={developer.id}
                    theme={theme}
                    developer={developer}
                    onLikeDeveloper={(developerId, like) => {
                      likeDeveloperMutation.mutate({ developerId, like });
                    }}
                  />
                );
              })}
            </Box>

            <AppPagination
              page={page}
              onChange={setPage}
              total={data?.allPages ?? 0}
            />
          </Stack>
        </Box>

        {/* ユーザー情報 */}
        <Stack
          h="min-content"
          sx={{ position: "sticky", top: appHeaderHeightPx + 10 }}
        >
          <Card
            sx={{
              flexShrink: 0,
              flexGrow: 0,
              height: "min-content",
            }}
            w={300}
          >
            <Flex gap="xs" align="center">
              <FaUserAlt size={15} fill={mantineTheme.colors.gray[5]} />
              <Text color="gray.5" size="sm">
                投稿者
              </Text>
            </Flex>
            <Flex gap={5} mt={5}>
              <UserIconLink iconSrc={theme.user.image} userId={theme.user.id} />
              <Text size={13}>{theme.user.name}</Text>
            </Flex>
          </Card>
        </Stack>
      </Flex>
    </Flex>
  );
};
