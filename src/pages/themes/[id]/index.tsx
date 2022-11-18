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
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { RouterInputs } from "../../../server/trpc";
import { trpc } from "../../../client/trpc";
import { showNotification } from "@mantine/notifications";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { GetServerSidePropsWithReactQuery } from "../../../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../../../server/routers/_app";
import { useSessionQuery } from "../../../client/hooks/useSessionQuery";
import {
  themeQueryKey,
  useThemeQuery,
} from "../../../client/hooks/useThemeQuery";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
  query,
}) => {
  const { id: themeId } = query;
  if (typeof themeId !== "string") {
    return { notFound: true };
  }

  // セッションを取得する
  const session = await unstable_getServerSession(req, res, authOptions);
  const caller = appRouter.createCaller({ session });

  // 表示するテーマ
  // TODO prefecthQueryの仕様を調べて、awaitが必要か考える
  const theme = await caller.themes.get({ themeId });
  // ログインユーザーが表示するテーマにいいねしているか
  const liked = await caller.themes.liked({ themeId });
  // 表示するテーマの参加者
  const developers = await caller.themes.getAllDevelopers({ themeId });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`theme-${themeId}`], () => theme);
  await queryClient.prefetchQuery(
    [`theme-${themeId}-liked-${session?.user.id}`],
    () => liked
  );
  await queryClient.prefetchQuery(
    [`theme-${themeId}-developers`],
    () => developers
  );

  const dehydratedState = dehydrate(queryClient);

  return { props: { dehydratedState } };
};

export const ThemeDetail = () => {
  const { session } = useSessionQuery();
  const router = useRouter();
  // TODO
  const themeId = router.query.id as string;

  const { theme } = useThemeQuery(themeId);

  const { data: liked } = useQuery(
    [`theme-${themeId}-liked-${session?.user.id}`],
    () => {
      return trpc.themes.liked.query({ themeId });
    }
  );

  const { data: developers } = useQuery(
    [`theme-${themeId}-developers`],
    () => {
      return trpc.themes.getAllDevelopers.query({ themeId });
    },
    { initialData: [] }
  );

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
