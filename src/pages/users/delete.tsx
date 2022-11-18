import { Button, Text } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import { showNotification } from "@mantine/notifications";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import { dehydrate, QueryClient, useMutation } from "@tanstack/react-query";
import { trpc } from "../../client/trpc";
import { GetServerSidePropsWithReactQuery } from "../../server/lib/GetServerSidePropsWithReactQuery";
import { sessionQuerykey } from "../../client/hooks/useSessionQuery";

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

const DeleteUser: NextPage = () => {
  const router = useRouter();
  const deleteMutation = useMutation({
    mutationFn: () => {
      return trpc.users.me.delete.mutate();
    },
    onSuccess: () => {
      // TODO
      router.reload();
    },
    onError: () => {
      showNotification({
        color: "red",
        title: "ユーザー削除",
        message: "ユーザーを削除できませんでした。",
      });
    },
  });

  const handleDeleteUser = async () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <Text>ユーザー削除</Text>
      <Button variant="light" color={"red"} onClick={handleDeleteUser}>
        ユーザーを削除する
      </Button>
    </>
  );
};

export default DeleteUser;
