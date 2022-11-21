import { Button, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { RouterInputs } from "../../server/trpc";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { trpc } from "../trpc";

export const UserEditPage: React.FC = () => {
  const { session } = useSessionQuery();
  const [name, setName] = useState(session?.user?.name || "");

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
};
