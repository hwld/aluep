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
import { HomePage } from "../client/components/HomePage";
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
  return <HomePage />;
}
