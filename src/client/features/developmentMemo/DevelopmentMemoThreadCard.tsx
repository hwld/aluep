import { ChildDevelopmentMemoSection } from "@/client/features/developmentMemo/DevelopmentMemoChildrenSection";
import { DevelopmentMemoMenuButton } from "@/client/features/developmentMemo/DevelopmentMemoMenuButton";
import { useDevelopmentMemos } from "@/client/features/developmentMemo/useDevelopmentMemos";
import { DevelopmentMemoReplyFormBox } from "@/client/features/ideaComment/DevelopMemoReplyFormBox";
import { UserIconLink } from "@/client/features/user/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { CardActionIcon } from "@/client/ui/CardActionIcon";
import {
  DevelopmentMemo,
  DevelopmentMemoFormData,
} from "@/models/developmentMemo";
import {
  Card,
  Divider,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { FaRegComment } from "react-icons/fa";

type Props = {
  ideaId: string;
  developmentId: string;
  memo: DevelopmentMemo;
  childrenMemos: DevelopmentMemo[];
  loggedInUserId?: string;
};
export const DevelopmentMemoThreadCard: React.FC<Props> = ({
  ideaId,
  developmentId,
  memo,
  childrenMemos,
  loggedInUserId,
}) => {
  const { colors } = useMantineTheme();
  const { createMemoMutation, deleteMemoMutation } = useDevelopmentMemos({
    developmentId,
  });
  const [isOpenReplyForm, setIsOpenReplyForm] = useState(false);
  const memoRef = useHashRemoverOnClickOutside({
    canRemove: (hash) => hash === memo.id,
  });

  const replyTargetMemoId = useMemo(() => {
    if (childrenMemos.length === 0) {
      return memo.id;
    }

    return childrenMemos.at(-1)!.id;
  }, [childrenMemos, memo.id]);

  const handleOpenReplyForm = () => {
    setIsOpenReplyForm(true);
  };

  const handleCloseReplyForm = () => {
    setIsOpenReplyForm(false);
  };

  const handleSubmitMemo = (data: DevelopmentMemoFormData) => {
    createMemoMutation.mutate({
      ...data,
      developmentId,
      parentMemoId: replyTargetMemoId,
    });
  };

  const handleDeleteMemo = (id: string) => {
    deleteMemoMutation.mutate({ developmentMemoId: id });
  };

  return (
    <Card>
      <Stack
        ref={memoRef}
        spacing="md"
        id={memo.id}
        sx={(theme) => ({
          "&:target": {
            outline: `${theme.fn.rgba(theme.colors.red[7], 0.5)} solid 2px`,
            outlineOffset: "5px",
            borderRadius: theme.radius.xs,
          },
        })}
      >
        <Flex justify="space-between">
          <Flex align="center" gap="xs">
            <UserIconLink
              userId={memo.fromUser.id}
              iconSrc={memo.fromUser.imageUrl}
            />
            <Text c="gray.5" size="xs" truncate>
              {memo.fromUser.name}
            </Text>
          </Flex>
          <DevelopmentMemoMenuButton
            ideaId={ideaId}
            developmentId={developmentId}
            developmentMemoId={memo.id}
            isOwner={memo.fromUser.id === loggedInUserId}
            onDeleteMemo={handleDeleteMemo}
            isDeleting={deleteMemoMutation.isLoading}
          />
        </Flex>
        <Text sx={{ whiteSpace: "pre-line" }}>{memo.memo}</Text>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={3}>
            <CardActionIcon onClick={handleOpenReplyForm}>
              <FaRegComment color={colors.gray[5]} size={20} />
            </CardActionIcon>
            {childrenMemos.length > 0 && (
              <Text c="gray.5" size="sm">
                {childrenMemos.length}
              </Text>
            )}
          </Flex>
          <Text c="gray.5" size="sm">
            {formatDate(memo.createdAt)}
          </Text>
        </Flex>
      </Stack>
      <ChildDevelopmentMemoSection
        ideaId={ideaId}
        developmentId={developmentId}
        childMemos={childrenMemos}
        isOpenReplyForm={isOpenReplyForm}
        onOpenReplyForm={handleOpenReplyForm}
        onCloseReplyForm={handleCloseReplyForm}
      />
      {isOpenReplyForm && (
        <>
          {childrenMemos.length === 0 && <Divider my="md" />}
          <DevelopmentMemoReplyFormBox
            onSubmit={handleSubmitMemo}
            onCancel={handleCloseReplyForm}
            isSubmitting={createMemoMutation.isLoading}
          />
        </>
      )}
    </Card>
  );
};
