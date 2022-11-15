import {
  AppShell,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Header,
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
  const session = useSession();
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
          {session.status === "unauthenticated" && (
            <div>
              <Button onClick={() => signIn("github")}>ログイン</Button>
            </div>
          )}
          {session.status === "authenticated" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Avatar
                src={session.data.user?.image}
                size="xl"
                sx={{ borderRadius: "100px" }}
              />
              <Text>{session.data.user?.name}</Text>
              <Text>{session.data.user?.email}</Text>
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
            <Card shadow="sm" withBorder id={theme.id} key={theme.id}>
              <Title>{theme.title}</Title>
              <Flex gap={5} wrap="wrap">
                {theme.tags.map((tag) => {
                  return (
                    <Badge sx={{ textTransform: "none" }} key={tag.id}>
                      {tag.name}
                    </Badge>
                  );
                })}
              </Flex>
              <Avatar src={theme.user.image} radius="xl" size="md" />
              <Text>{theme.user.name}</Text>
              <Text>{new Date(theme.createdAt).toLocaleString()}</Text>

              <Flex gap={5}>
                <Button component={Link} href={`/themes/${theme.id}`}>
                  詳細
                </Button>
                {session.data?.user.id === theme.user.id && (
                  <>
                    <Button
                      component={Link}
                      href={`/themes/${theme.id}/update`}
                      variant="outline"
                    >
                      更新
                    </Button>
                    <Button
                      onClick={() => {
                        handleDeleteTheme(theme.id);
                      }}
                      variant="outline"
                    >
                      削除
                    </Button>
                  </>
                )}
              </Flex>
            </Card>
          );
        })}
      </Stack>
    </AppShell>
  );
}
