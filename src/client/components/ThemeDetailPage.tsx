import {
  Box,
  Card,
  Flex,
  MediaQuery,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Theme } from "../../server/models/theme";
import { useRequireLoginModal } from "../contexts/RequireLoginModalProvider";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeJoin } from "../hooks/useThemeJoin";
import { useThemeLike } from "../hooks/useThemeLike";
import { ThemeComments } from "./ThemeComments";
import { ThemeJoinButton } from "./ThemeJoinButton";
import { ThemeLikeButton } from "./ThemeLikeButton";
import { ThemeOperationButton } from "./ThemeOperationButton";
import { ThemeTagBadge } from "./ThemeTagBadge";
import { UserIconLink } from "./UserIconLink";

type Props = { theme: Theme };

export const ThemeDetailPage: React.FC<Props> = ({ theme }) => {
  const mantineTheme = useMantineTheme();

  const { session } = useSessionQuery();
  const router = useRouter();
  const { openLoginModal } = useRequireLoginModal();
  const { likeThemeMutation, likedByLoggedInUser } = useThemeLike(theme.id);
  const {
    data: { joinData },
  } = useThemeJoin(theme.id);

  const handleLikeTheme = () => {
    //ログインしていなければログインモーダルを表示する
    if (!session) {
      openLoginModal();
      return;
    }

    likeThemeMutation.mutate({
      themeId: theme.id,
      like: !likedByLoggedInUser,
    });
  };

  const handleClickJoin = (e: SyntheticEvent) => {
    // ログインしていなければログインモーダルを表示する
    if (!session) {
      openLoginModal(`/themes/${theme.id}/join`);
      return;
    }

    router.push(`/themes/${theme.id}/join`);
  };

  // 自分の投稿かどうか
  const isThemeOwner = theme.user.id === session?.user.id;

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Title align="center" color="red.7">
        {theme.title}
      </Title>
      <Flex mt="xl" gap="lg" w="100%">
        {/* 左カラム */}
        <Flex
          direction="column"
          align="center"
          gap="sm"
          h="min-content"
          // 左カラムで表示するダイアログがお題の説明の下にならないように、中カラムよりも上に配置する
          sx={{ position: "sticky", top: 10, zIndex: 1 }}
        >
          <ThemeJoinButton
            themeId={theme.id}
            developers={theme.developers}
            loggedInUserJoinData={joinData}
            onJoinTheme={handleClickJoin}
          />
          <ThemeLikeButton
            themeId={theme.id}
            likes={theme.likes}
            likedByLoggedInUser={likedByLoggedInUser}
            onLikeTheme={handleLikeTheme}
            disabled={isThemeOwner}
          />
          <ThemeOperationButton theme={theme} isThemeOwner={isThemeOwner} />
        </Flex>

        {/* 中カラム */}
        <Box sx={{ flexGrow: 1 }}>
          <Card mih={300}>
            <Flex gap={10} mb={10} wrap="wrap">
              {theme.tags.map((tag) => (
                <ThemeTagBadge tagId={tag.id} key={tag.id}>
                  {tag.name}
                </ThemeTagBadge>
              ))}
            </Flex>
            <Text>{theme.description}</Text>
          </Card>

          <ThemeComments themeId={theme.id} themeOwnerId={theme.user.id} />
        </Box>

        {/* 右カラム */}
        <MediaQuery smallerThan="md" styles={{ display: "none" }}>
          <Stack
            h="min-content"
            // 左カラムで表示するダイアログがお題の説明の下にならないように、中カラムよりも上に配置する
            sx={{ position: "sticky", top: 10, zIndex: 1 }}
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
                <UserIconLink
                  iconSrc={theme.user.image}
                  userId={theme.user.id}
                />
                <Text size={13}>{theme.user.name}</Text>
              </Flex>
            </Card>
          </Stack>
        </MediaQuery>
      </Flex>
    </Flex>
  );
};
