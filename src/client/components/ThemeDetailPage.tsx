import {
  Avatar,
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
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeDevelopersQuery } from "../hooks/useThemeDevelopersQuery";
import { useThemeJoin } from "../hooks/useThemeJoin";
import { useThemeLike } from "../hooks/useThemeLike";
import { ThemeDeveloperCard } from "./ThemeDeveloperCard";
import { ThemeLikeButton } from "./ThemeLikeButton";
import { ThemeTagBadge } from "./ThemeTagBadge";

type Props = { theme: Theme };
export const ThemeDetailPage: React.FC<Props> = ({ theme }) => {
  const mantineTheme = useMantineTheme();

  const { session } = useSessionQuery();
  const { likeThemeMutation, likedByLoggedInUser } = useThemeLike(theme.id);
  const {
    data: { joined },
  } = useThemeJoin(theme.id);
  const { developers, likeDeveloperMutation } = useThemeDevelopersQuery(
    theme.id
  );

  const handleLikeTheme = () => {
    likeThemeMutation.mutate({
      themeId: theme.id,
      like: !likedByLoggedInUser,
    });
  };

  // ログインしていて、テーマの投稿者と異なればいいねができる
  const canLike = Boolean(session && theme.user.id !== session.user.id);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Title align="center">{theme.title}</Title>
      <Flex mt="xl" gap="lg" w="100%">
        {/* いいねボタン */}
        <Flex direction="column" align="center" gap="xs">
          <ThemeLikeButton
            likes={theme.likes}
            likedByLoggedInUser={likedByLoggedInUser}
            onClick={handleLikeTheme}
            disabled={!canLike}
          />
          <Button
            component={Link}
            href={`/themes/${theme?.id}/likelist`}
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
          <Title mt={30} order={4}>
            参加している開発者
          </Title>
          <Stack mt={10}>
            {developers.map((developer) => {
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
          </Stack>
        </Box>
        {/* ユーザー情報 */}
        <Card
          sx={{ flexShrink: 0, flexGrow: 0, height: "min-content" }}
          w={250}
        >
          <Flex gap={3} align="center">
            <FaUserAlt size={15} fill={mantineTheme.colors.gray[5]} />
            <Text color="gray.5" size="sm">
              投稿者
            </Text>
          </Flex>
          <Flex gap={5} mt={5}>
            <Avatar
              src={theme.user.image}
              size="md"
              sx={(theme) => ({
                borderWidth: "2px",
                borderColor: theme.colors.gray[2],
                borderStyle: "solid",
                borderRadius: "100%",
              })}
            />
            <Text size={13}>{theme.user.name}</Text>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
