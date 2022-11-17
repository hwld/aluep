import Link from "next/link";
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
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { prisma } from "../../../server/prismadb";
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { RouterInputs } from "../../../server/trpc";
import { trpc } from "../../../client/trpc";
import { showNotification } from "@mantine/notifications";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";

export const getServerSideProps = async ({
  req,
  res,
  query,
}: GetServerSidePropsContext) => {
  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

  // 表示するテーマ
  const rawTheme = await prisma.appTheme.findUnique({
    where: { id: themeId },
    include: {
      tags: true,
      user: true,
      likes: true,
    },
  });
  if (!rawTheme) {
    return { notFound: true };
  }
  const theme = {
    id: rawTheme.id,
    title: rawTheme.title,
    tags: rawTheme.tags.map(({ id, name }) => ({ id, name })),
    description: rawTheme.description,
    createdAt: rawTheme.createdAt.toUTCString(),
    updatedAt: rawTheme.updatedAt.toUTCString(),
    user: {
      id: rawTheme.user.id,
      name: rawTheme.user.name,
      image: rawTheme.user.image,
    },
    likes: rawTheme.likes.length,
  };

  // ログインユーザーが表示するテーマにいいねしているか
  const session = await unstable_getServerSession(req, res, authOptions);
  const liked = rawTheme.likes.find((like) => like.userId === session?.user.id)
    ? true
    : false;

  // 表示するテーマの参加者
  const rawDevelopers = await prisma.appThemeDeveloper.findMany({
    where: { appThemeId: themeId },
    include: { user: true, likes: true },
  });
  const developers = rawDevelopers.map(
    ({ id, user, githubUrl, comment, createdAt, likes }) => ({
      id,
      userid: user.id,
      name: user.name,
      image: user.image,
      githubUrl,
      comment,
      likes: likes.length,
      // ログインユーザーがいいねしているか
      liked: likes.find((like) => like.userId === session?.user.id)
        ? true
        : false,
      createdAt: createdAt.toUTCString(),
    })
  );

  return { props: { theme, developers, liked } };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export const ThemeDetail: NextPage<PageProps> = ({
  theme,
  developers,
  liked,
}) => {
  const router = useRouter();

  const likeThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["themes"]["like"]) => {
      return trpc.themes.like.mutate(data);
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
    mutationFn: (data: RouterInputs["developers"]["like"]) => {
      return trpc.developers.like.mutate(data);
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
    likeThemeMutation.mutate({ themeId: theme.id, like: !liked });
  };

  const handleLikeDeveloper = (developerId: string, like: boolean) => {
    likeDeveloperMutation.mutate({ developerId, like });
  };

  return (
    <Box p={30}>
      <Title>{theme.title}</Title>
      <Avatar src={theme.user.image} size="xl" radius={100} />
      <Text>{theme.user.name}</Text>
      <Flex gap={10}>
        {theme.tags.map((tag) => {
          return (
            <Badge key={tag.id} sx={{ textTransform: "none" }}>
              {tag.name}
            </Badge>
          );
        })}
      </Flex>
      <Text sx={{ whiteSpace: "pre-wrap" }}>{theme.description}</Text>

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
      <Text>{theme.likes}</Text>

      <Button mt={30} component={Link} href={`/themes/${theme.id}/join`}>
        参加する
      </Button>
      <Title mt={30}>開発者</Title>
      <Stack mt={10}>
        {developers.map((developer) => {
          return (
            <Card key={developer.userid} shadow="sm" withBorder>
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
                  color={developer.liked ? "pink" : undefined}
                  size={30}
                  radius="xl"
                  variant="outline"
                  onClick={() => {
                    handleLikeDeveloper(developer.id, !developer.liked);
                  }}
                >
                  {developer.liked ? (
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
export default ThemeDetail;
