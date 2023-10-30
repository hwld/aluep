import { DevMemoChildrenSection } from "@/client/features/devMemo/DevMemoChildrenSection/DevMemoChildrenSection";
import { DevMemoMenuButton } from "@/client/features/devMemo/DevMemoMenuButton/DevMemoMenuButton";
import { DevMemoReplyFormBox } from "@/client/features/devMemo/DevMemoReplyFormBox/DevMemoReplyFormBox";
import { useDevMemos } from "@/client/features/devMemo/useDevMemos";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { AppLinkify } from "@/client/ui/AppLinkify/AppLinkify";
import { CardActionIcon } from "@/client/ui/CardActionIcon/CardActionIcon";
import { SvgMessageCircle2 } from "@/client/ui/Icons";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { DevMemo, DevMemoFormData } from "@/models/devMemo";
import { Card, Divider, Flex, Stack, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import classes from "./DevMemoThreadCard.module.css";

type Props = {
  devId: string;
  memo: DevMemo;
  childrenMemos: DevMemo[];
  loggedInUserId?: string;
};
export const DevMemoThreadCard: React.FC<Props> = ({
  devId,
  memo,
  childrenMemos,
  loggedInUserId,
}) => {
  const { createMemoMutation, deleteMemoMutation } = useDevMemos({ devId });
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

  const handleSubmitMemo = (data: DevMemoFormData) => {
    createMemoMutation.mutate({
      ...data,
      devId,
      parentMemoId: replyTargetMemoId,
    });
  };

  const handleDeleteMemo = (id: string) => {
    deleteMemoMutation.mutate({ devMemoId: id });
  };

  return (
    <Card>
      <Stack ref={memoRef} gap="md" id={memo.id} className={classes.root}>
        <Flex justify="space-between">
          <Flex align="center" gap="xs">
            <UserIconLink
              userId={memo.fromUser.id}
              iconSrc={memo.fromUser.imageUrl}
            />
            <MutedText truncate>{memo.fromUser.name}</MutedText>
          </Flex>
          <DevMemoMenuButton
            devId={devId}
            devMemoId={memo.id}
            isOwner={memo.fromUser.id === loggedInUserId}
            onDeleteMemo={handleDeleteMemo}
            isDeleting={deleteMemoMutation.isLoading}
          />
        </Flex>
        <AppLinkify>
          <Text className={classes["memo-text"]}>{memo.text}</Text>
        </AppLinkify>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={3}>
            <CardActionIcon c="gray.5" onClick={handleOpenReplyForm}>
              <SvgMessageCircle2 width={20} height={20} />
            </CardActionIcon>
            {childrenMemos.length > 0 && (
              <MutedText>{childrenMemos.length}</MutedText>
            )}
          </Flex>
          <MutedText>{formatDate(memo.createdAt)}</MutedText>
        </Flex>
      </Stack>
      <DevMemoChildrenSection
        devId={devId}
        childMemos={childrenMemos}
        isOpenReplyForm={isOpenReplyForm}
        onOpenReplyForm={handleOpenReplyForm}
        onCloseReplyForm={handleCloseReplyForm}
      />
      {isOpenReplyForm && (
        <>
          {childrenMemos.length === 0 && <Divider my="md" />}
          <DevMemoReplyFormBox
            onSubmit={handleSubmitMemo}
            onCancel={handleCloseReplyForm}
            isSubmitting={createMemoMutation.isLoading}
          />
        </>
      )}
    </Card>
  );
};
