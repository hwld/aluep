import { DevelopmentMemoMenuButton } from "@/client/features/developmentMemo/DevelopmentMemoMenuButton";
import { useDevelopmentMemos } from "@/client/features/developmentMemo/useDevelopmentMemos";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { DevelopmentMemo } from "@/server/models/developmentMemo";
import { Flex, Stack, Text } from "@mantine/core";

type Props = { memo: DevelopmentMemo; developmentId: string; ideaId: string };

export const DevelopmentMemoChild: React.FC<Props> = ({
  memo,
  developmentId,
  ideaId,
}) => {
  const { session } = useSessionQuery();
  const { deleteMemoMutation } = useDevelopmentMemos({ developmentId });
  const memoRef = useHashRemoverOnClickOutside({
    canRemove: (hash) => hash === memo.id,
  });

  const handleDeleteMemo = (id: string) => {
    deleteMemoMutation.mutate({ developmentMemoId: id });
  };

  return (
    <Flex
      ref={memoRef}
      id={memo.id}
      gap="xs"
      sx={(theme) => ({
        "&:target": {
          outline: `${theme.fn.rgba(theme.colors.red[7], 0.5)} solid 2px`,
          outlineOffset: "5px",
          borderRadius: theme.radius.xs,
        },
      })}
    >
      <Stack>
        <UserIconLink
          userId={memo.fromUser.id}
          iconSrc={memo.fromUser.imageUrl}
        />
      </Stack>
      <Stack spacing="md" sx={{ flexGrow: 1 }}>
        <Flex justify="space-between">
          <Stack spacing={0}>
            <Text c="gray.5" size="xs">
              {memo.fromUser.name}
            </Text>
            <Flex>
              <Text c="gray.7" size="xs">
                {formatDate(memo.createdAt)}
              </Text>
            </Flex>
          </Stack>
          <DevelopmentMemoMenuButton
            ideaId={ideaId}
            developmentId={developmentId}
            developmentMemoId={memo.id}
            isOwner={memo.fromUser.id === session?.user.id}
            onDeleteMemo={handleDeleteMemo}
            isDeleting={deleteMemoMutation.isLoading}
          />
        </Flex>
        <Text sx={{ whiteSpace: "pre-wrap" }}>{memo.memo}</Text>
      </Stack>
    </Flex>
  );
};
