import { DevMemoChildrenSection } from "@/client/features/devMemo/DevMemoChildrenSection/DevMemoChildrenSection";
import { DevMemoMenuButton } from "@/client/features/devMemo/DevMemoMenuButton/DevMemoMenuButton";
import { DevMemoReplyFormBox } from "@/client/features/devMemo/DevMemoReplyFormBox/DevMemoReplyFormBox";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { AppLinkify } from "@/client/ui/AppLinkify/AppLinkify";
import { CardActionIcon } from "@/client/ui/CardActionIcon/CardActionIcon";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { DevMemo } from "@/models/devMemo";
import { Card, Divider, Flex, Stack, Text } from "@mantine/core";
import { IconMessageCircle2 } from "@tabler/icons-react";
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
  const memoRef = useHashRemoverOnClickOutside({
    canRemove: (hash) => hash === memo.id,
  });

  const [isOpenReplyForm, setIsOpenReplyForm] = useState(false);
  const handleOpenReplyForm = () => {
    setIsOpenReplyForm(true);
  };

  const handleCloseReplyForm = () => {
    setIsOpenReplyForm(false);
  };

  const parentMemoId = useMemo(() => {
    if (childrenMemos.length === 0) {
      return memo.id;
    }

    return childrenMemos.at(-1)!.id;
  }, [childrenMemos, memo.id]);

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
          />
        </Flex>
        <AppLinkify>
          <Text className={classes["memo-text"]}>{memo.text}</Text>
        </AppLinkify>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={3}>
            <CardActionIcon c="gray.5" onClick={handleOpenReplyForm}>
              <IconMessageCircle2 width={20} height={20} />
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
            devId={devId}
            parentMemoId={parentMemoId}
            onCancel={handleCloseReplyForm}
          />
        </>
      )}
    </Card>
  );
};
