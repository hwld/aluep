import {
  ActionIcon,
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
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { RouterInputs } from "../../server/trpc";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { trpc } from "../trpc";
import { ThemeDeveloperCard } from "./ThemeDeveloperCard";
import { ThemeTagBadge } from "./ThemeTagBadge";

export const ThemeDetailPage: React.FC = () => {
  const { session } = useSessionQuery();
  const router = useRouter();
  // TODO
  const themeId = router.query.id as string;

  const { theme } = useThemeQuery(themeId);

  const { data: liked } = useQuery(
    [`theme-${themeId}-liked-${session?.user.id}`],
    () => {
      return trpc.theme.liked.query({ themeId });
    }
  );

  const { data: developers } = useQuery(
    [`theme-${themeId}-developers`],
    () => {
      return trpc.theme.getAllDevelopers.query({ themeId });
    },
    { initialData: [] }
  );

  const likeThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["theme"]["like"]) => {
      return trpc.theme.like.mutate(data);
    },
    onSuccess: () => {
      // TODO
      router.reload();
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題へのいいね",
        message: "お題にいいねできませんでした。",
      });
    },
  });

  const likeDeveloperMutation = useMutation({
    mutationFn: (data: RouterInputs["themeDeveloper"]["like"]) => {
      return trpc.themeDeveloper.like.mutate(data);
    },
    onSuccess: () => {
      // TODo
      router.reload();
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "開発者へのいいね",
        message: "開発者にいいねできませんでした。",
      });
    },
  });

  const handleLikeTheme = () => {
    if (!theme) return;
    likeThemeMutation.mutate({ themeId: theme?.id, like: !liked });
  };

  const mantineTheme = useMantineTheme();

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Title>{theme?.title}</Title>
      <Flex mt={30} gap={30} w="100%">
        <Flex direction="column" align="center">
          <ActionIcon
            color={liked ? "pink" : undefined}
            size={60}
            radius="xl"
            variant="outline"
            sx={{ borderWidth: "2px" }}
            onClick={handleLikeTheme}
          >
            {liked ? (
              <MdOutlineFavorite size="70%" style={{ marginTop: "4px" }} />
            ) : (
              <MdOutlineFavoriteBorder
                size="70%"
                style={{ marginTop: "4px" }}
              />
            )}
          </ActionIcon>
          <Text>{theme?.likes}</Text>
        </Flex>
        {/* 説明 */}
        <Box sx={{ flexGrow: 1 }}>
          <Card mih={300}>
            <Flex gap={10} mb={10} wrap="wrap">
              {theme?.tags.map((tag) => (
                <ThemeTagBadge key={tag.id}>{tag.name}</ThemeTagBadge>
              ))}
            </Flex>
            <Text sx={{ whiteSpace: "pre-wrap" }}>{theme?.description}</Text>
          </Card>
          <Button mt={15} component={Link} href={`/themes/${theme?.id}/join`}>
            参加する
          </Button>
          <Title mt={30} order={2}>
            参加している開発者
          </Title>
          <Stack mt={10}>
            {developers.map((developer) => {
              return (
                <ThemeDeveloperCard
                  key={developer.id}
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
              src={theme?.user.image}
              size="md"
              sx={(theme) => ({
                borderWidth: "2px",
                borderColor: theme.colors.gray[2],
                borderStyle: "solid",
                borderRadius: "100%",
              })}
            />
            <Text size={13}>{theme?.user.name}</Text>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};
