import { Button, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../../client/trpc";
import { RouterInputs } from "../../server/trpc";
import { authOptions } from "../api/auth/[...nextauth]";

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

// TODO: formのエラーハンドリングのためにreact-hook-formを導入する
export default function Profile() {
  const session = useSession();
  const [name, setName] = useState(session.data?.user?.name || "");

  const updateMutation = useMutation({
    mutationFn: (data: RouterInputs["users"]["me"]["update"]) => {
      return trpc.users.me.update.mutate(data);
    },
    onSuccess: () => {
      showNotification({
        title: "更新結果",
        message: "プロフィールを更新しました。",
        color: "green",
      });
    },
    onError: () => {
      showNotification({
        title: "更新結果",
        message: "プロフィールを更新できませんでした。",
        color: "red",
      });
    },
  });

  const handleUpdateUser = () => {
    updateMutation.mutate({ name });
  };

  return (
    <div>
      <TextInput
        label="表示名"
        value={name}
        onChange={({ target: { value } }) => {
          setName(value);
        }}
      ></TextInput>
      <Button onClick={handleUpdateUser}>更新する</Button>
    </div>
  );
}
