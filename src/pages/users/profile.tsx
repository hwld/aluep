import { Button, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { dehydrate, QueryClient, useMutation } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { UserEditPage } from "../../client/components/UserEditPage";
import {
  sessionQuerykey,
  useSessionQuery,
} from "../../client/hooks/useSessionQuery";
import { trpc } from "../../client/trpc";
import { GetServerSidePropsWithReactQuery } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { RouterInputs } from "../../server/trpc";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSidePropsWithReactQuery = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  // セッションがないときはホームにリダイレクトする
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(sessionQuerykey, () => session);
  const dehydratedState = dehydrate(queryClient);

  return {
    props: {
      dehydratedState,
    },
  };
};

// TODO: formのエラーハンドリングのためにreact-hook-formを導入する
export default function Profile() {
  return <UserEditPage />;
}
