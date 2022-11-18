import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth/next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  sessionQuerykey,
  useSessionQuery,
} from "../client/hooks/useSessionQuery";
import { trpc } from "../client/trpc";
import { GetServerSidePropsWithReactQuery } from "../server/lib/GetServerSidePropsWithReactQuery";
import { appRouter } from "../server/routers/_app";
import { RouterInputs } from "../server/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
}) => {
  // trpcのapiをサーバー側から呼び出すために、コンテキストを指定してcallerを作る
  const caller = appRouter.createCaller({ session: null });

  const session = await unstable_getServerSession(req, res, authOptions);
  const themes = caller.themes.getAll();

  // react-queryを使用してデータを渡し、dehydrateしてクライアントに送る
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(sessionQuerykey, () => session);
  await queryClient.prefetchQuery(["themes"], () => themes);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

export default function Home() {
  const router = useRouter();
  const { session } = useSessionQuery();
  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: () => {
      return trpc.themes.getAll.query();
    },
    initialData: [],
  });

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
    <div>
      <Text>アプリ開発のお題</Text>
      <Button
        component={Link}
        href="/themes/search"
        mt={10}
        sx={{ display: "block" }}
      >
        お題を検索する
      </Button>
      <Button
        component={Link}
        href="/themes/create"
        mt={10}
        sx={{ display: "block" }}
      >
        新しいお題を投稿する
      </Button>
      <Stack mt={30}>
        {themes.map((theme) => {
          return (
            <Card shadow="sm" withBorder key={theme.id}>
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
                {session?.user.id === theme.user.id && (
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
    </div>
  );
}
