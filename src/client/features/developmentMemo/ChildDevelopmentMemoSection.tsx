import { Box, Button, Divider, Flex, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { DevelopmentMemo } from "../../../server/models/developmentMemo";
import { DevelopmentMemoFormData } from "../../../share/schema";
import { DevelopmentMemoReplyForm } from "../ideaComment/DevelopMemoReplyForm";
import { UserIconLink } from "../user/UserIconLink";

type Props = {
  developmentId: string;
  childMemos: DevelopmentMemo[];
  onSubmitReply: (data: DevelopmentMemoFormData) => void;
  isSubmittingReply?: boolean;
};
export const ChildDevelopmentMemoSection: React.FC<Props> = ({
  developmentId,
  childMemos,
  onSubmitReply,
  isSubmittingReply = false,
}) => {
  const [isOpenReplyForm, setIsOpenReplyForm] = useState(false);

  const handleOpenReplyForm = () => {
    setIsOpenReplyForm(true);
  };
  const handleCloseReplyForm = () => {
    setIsOpenReplyForm(false);
  };

  return (
    <Box>
      <Divider></Divider>
      <Stack
        spacing="xl"
        py="md"
        sx={(theme) => ({
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: "20px",
            bottom: "0",
            left: "17px",
            width: "2px",
            background: theme.colors.gray[3],
          },
        })}
      >
        {childMemos.map((memo) => {
          return (
            <Flex key={memo.id} gap="xs">
              <Stack>
                <UserIconLink
                  userId={memo.fromUser.id}
                  iconSrc={memo.fromUser.imageUrl}
                />
              </Stack>
              <Stack spacing="md">
                <Text c="gray.5" size="xs">
                  {memo.fromUser.name}
                </Text>
                <Text>{memo.memo}</Text>
              </Stack>
            </Flex>
          );
        })}
      </Stack>
      {isOpenReplyForm ? (
        <Box
          p="xs"
          sx={(theme) => ({
            borderRadius: theme.radius.md,
            border: "1px solid",
            borderColor: theme.colors.gray[4],
          })}
        >
          <DevelopmentMemoReplyForm
            developmentId={developmentId}
            parentMemoId={childMemos.at(-1)!.id}
            onSubmit={onSubmitReply}
            onCancel={handleCloseReplyForm}
            isSubmitting={isSubmittingReply}
          />
        </Box>
      ) : (
        <Button
          variant="outline"
          color="gray.5"
          sx={(theme) => ({
            transition: "background-color 250ms",
            "&:hover": { backgroundColor: theme.colors.gray[2] },
          })}
          onClick={handleOpenReplyForm}
        >
          返信する
        </Button>
      )}
    </Box>
  );
};
