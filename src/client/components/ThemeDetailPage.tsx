import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { RouterInputs } from "../../server/trpc";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { trpc } from "../trpc";

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

  const handleLikeDeveloper = (developerId: string, like: boolean) => {
    likeDeveloperMutation.mutate({ developerId, like });
  };

  return (
    <Box p={30}>
      <Title>{theme?.title}</Title>
      <Avatar src={theme?.user.image} size="xl" radius={100} />
      <Text>{theme?.user.name}</Text>
      <Flex gap={10}>
        {theme?.tags.map((tag) => {
          return (
            <Badge key={tag.id} sx={{ textTransform: "none" }}>
              {tag.name}
            </Badge>
          );
        })}
      </Flex>
      <Text sx={{ whiteSpace: "pre-wrap" }}>{theme?.description}</Text>

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
          <MdOutlineFavoriteBorder size="70%" style={{ marginTop: "4px" }} />
        )}
      </ActionIcon>
      <Text>{theme?.likes}</Text>

      <Button mt={30} component={Link} href={`/themes/${theme?.id}/join`}>
        参加する
      </Button>
      <Title mt={30}>開発者</Title>
      <Stack mt={10}>
        {developers.map((developer) => {
          return (
            <Card key={developer.userId} shadow="sm" withBorder>
              <Avatar src={developer.image} />
              <Text>{developer.name}</Text>
              <Text>{developer.comment}</Text>
              <Text>{new Date(developer.createdAt).toLocaleString()}</Text>
              <Button
                component={Link}
                href={developer.githubUrl}
                target="_blank"
              >
                コードを見に行く
              </Button>
              <Box>
                <ActionIcon
                  mt={10}
                  color={developer.likedByLoggedInUser ? "pink" : undefined}
                  size={30}
                  radius="xl"
                  variant="outline"
                  onClick={() => {
                    handleLikeDeveloper(
                      developer.id,
                      !developer.likedByLoggedInUser
                    );
                  }}
                >
                  {developer.likedByLoggedInUser ? (
                    <MdOutlineFavorite
                      size="70%"
                      style={{ marginTop: "4px" }}
                    />
                  ) : (
                    <MdOutlineFavoriteBorder
                      size="70%"
                      style={{ marginTop: "1px" }}
                    />
                  )}
                </ActionIcon>
                <Text>{developer.likes}</Text>
              </Box>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};
