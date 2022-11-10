import { Button, Text } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import { showNotification } from "@mantine/notifications";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";

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

  const handleDeleteUser = async () => {
    const res = await fetch("/api/users/me", { method: "DELETE" });
    if (!res.ok) {
      showNotification({
        color: "red",
        title: "ユーザー削除",
        message: "ユーザーを削除できませんでした。",
      });
      return;
    } else {
      showNotification({
        color: "green",
        title: "ユーザー削除",
        message: "ユーザーを削除できました。",
      });
      router.reload();
      return;
    }
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
