import { Button, Text } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import { showNotification } from "@mantine/notifications";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "../../client/trpc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // セッションがないときはホームにリダイレクトする
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      session,
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
