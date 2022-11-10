import { Button, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";

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

export default function Profile() {
  const session = useSession();
  const [name, setName] = useState(session.data?.user?.name || "");

  const updateUserName = async () => {
    const data = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!data.ok) {
      showNotification({
        title: "更新結果",
        message: "プロフィールを更新できませんでした。",
        color: "red",
      });
    } else {
      showNotification({
        title: "更新結果",
        message: "プロフィールを更新しました。",
        color: "green",
      });
    }
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
      <Button onClick={updateUserName}>更新する</Button>
    </div>
  );
}
