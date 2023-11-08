import { useMutationWithNotification } from "@/client/lib/notification";
import { trpc } from "@/client/lib/trpc";
import { Dev } from "@/models/dev";
import { Switch } from "@mantine/core";

type Props = { dev: Dev };

export const ToggleDevMemoPermission: React.FC<Props> = ({ dev }) => {
  const toggleAllowOtherUserMemosMutation = useMutationWithNotification(
    trpc.dev.updateAllowOtherUserMemos,
    {
      errorNotification: {
        title: "開発メモの返信権限の更新",
        message: "開発メモの返信権限を更新できませんでした。",
      },
    }
  );

  const handleToggleAllowOtherUserMemos = () => {
    toggleAllowOtherUserMemosMutation.mutate({
      devId: dev.id,
      allowOtherUserMemos: !dev.allowOtherUserMemos,
    });
  };

  return (
    <Switch
      checked={dev.allowOtherUserMemos}
      onChange={handleToggleAllowOtherUserMemos}
      label="他のユーザーの返信を許可"
      styles={{
        track: { cursor: "pointer" },
        label: { cursor: "pointer", userSelect: "none" },
      }}
    />
  );
};
