import {
  AppShell,
  Avatar,
  Box,
  Button,
  Center,
  Header,
  Loader,
  Navbar,
  Text,
} from "@mantine/core";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
};

export default function Home() {
  const data = useSession();

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
              <Button component={Link} href="/profile">
                プロフィール変更
              </Button>
              <Button
                color="red"
                variant="outline"
                component={Link}
                href="/delete-user"
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
    </AppShell>
  );
}
