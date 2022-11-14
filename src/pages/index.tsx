import {
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Header,
  Loader,
  Navbar,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { isRegularExpressionLiteral } from "typescript";
import { trpc } from "../client/trpc";
import { prisma } from "../server/prismadb";
import { RouterInputs } from "../server/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const themes = (
    await prisma.appTheme.findMany({
      include: { tags: true, user: true },
    })
  ).map(({ id, title, description, tags, createdAt, updatedAt, user }) => ({
    id,
    title,
    description,
    tags: tags.map(({ id, name }) => ({ id, name })),
    user: { id: user.id, image: user.image, name: user.name },
    createdAt: createdAt.toUTCString(),
    updatedAt: updatedAt.toUTCString(),
  }));

  return {
    props: {
      session,
      themes,
    },
  };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Home({ themes }: PageProps) {
  const data = useSession();
  const router = useRouter();

  const deleteThemeMutation = useMutation({
    mutationFn: (data: RouterInputs["themes"]["delete"]) => {
      return trpc.themes.delete.mutate(data);
    },
    onSuccess: () => {
      router.reload();
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "お題の削除",
        message: "お題を削除できませんでした。",
      });
    },
  });

  const handleDeleteTheme = (id: string) => {
    deleteThemeMutation.mutate({ themeId: id });
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          {data.status === "unauthenticated" && (
            <div>
              <Button onClick={() => signIn("github")}>ログイン</Button>
            </div>
          )}
          {data.status === "authenticated" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Avatar
                src={data.data.user?.image}
                size="xl"
                sx={{ borderRadius: "100px" }}
              />
              <Text>{data.data.user?.name}</Text>
              <Text>{data.data.user?.email}</Text>
              <Button color="red" onClick={() => signOut()}>
                ログアウト
              </Button>
              <Button component={Link} href="/users/profile">
                プロフィール変更
              </Button>
              <Button
                color="red"
                variant="outline"
                component={Link}
                href="/users/delete"
              >
                アカウント削除
              </Button>
            </Box>
          )}
        </Navbar>
      }
      header={
        <Header
          height={60}
          p="xs"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Text fw={700}>AppThemePost</Text>
        </Header>
      }
    >
      <Text>アプリ開発のお題</Text>
      <Button component={Link} href="/themes/create">
        新しいお題を投稿する
      </Button>
      <Stack mt={30}>
        {themes.map((theme) => {
          return (
            <div id={theme.id}>
              <Title>{theme.title}</Title>
              <Flex gap={5} wrap="wrap">
                {theme.tags.map((tag) => {
                  return (
                    <Badge sx={{ textTransform: "none" }}>{tag.name}</Badge>
                  );
                })}
              </Flex>
              <Avatar src={theme.user.image} radius="xl" size="md" />
              <Text>{theme.user.name}</Text>
              <Text>{new Date(theme.createdAt).toLocaleString()}</Text>
              <Flex gap={5}>
                <Button component={Link} href={`/themes/${theme.id}/update`}>
                  更新
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteTheme(theme.id);
                  }}
                >
                  削除
                </Button>
              </Flex>
            </div>
          );
        })}
      </Stack>
    </AppShell>
  );
}
