import { IdeaCommentMenuButton } from "@/client/features/ideaComment/IdeaCommentMenuButton/IdeaCommentMenuButton";
import { IdeaCommentReplyFormCard } from "@/client/features/ideaComment/IdeaCommentReplyFormCard/IdeaCommentReplyFormCard";
import { useIdeaCommentReply } from "@/client/features/ideaComment/useIdeaCommentReply";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { AppLinkify } from "@/client/ui/AppLinkify/AppLinkify";
import { CardActionIcon } from "@/client/ui/CardActionIcon/CardActionIcon";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { IdeaComment, IdeaCommentFormData } from "@/models/ideaComment";
import { Box, Card, Flex, Stack, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  SvgChevronsRight,
  SvgMessageCircle,
  SvgUser,
} from "@tabler/icons-react";
import classes from "./IdeaCommentCard.module.css";

type Props = {
  ideaId: string;
  comment: IdeaComment;
  onDeleteComment: (id: string) => void;
  isDeleting?: boolean;
  isOwner: boolean;
  ideaOwnerId: string;
};

export const IdeaCommentCard: React.FC<Props> = ({
  ideaId,
  comment,
  onDeleteComment,
  isDeleting = false,
  isOwner,
  ideaOwnerId,
}) => {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  const commentRef = useHashRemoverOnClickOutside({
    canRemove: (hash) => {
      return hash === comment.id;
    },
  });

  const [isReplyFormOpen, { close: closeReplyForm, open: openReplyForm }] =
    useDisclosure(false);

  const { replyMutation } = useIdeaCommentReply({
    closeReplyForm,
    onSuccess: () => {
      closeReplyForm();
    },
  });

  const handleDelete = () => {
    onDeleteComment(comment.id);
  };

  const handleOpenReplyForm = () => {
    if (!session) {
      openLoginModal();
      return;
    }
    openReplyForm();
  };

  const handleSubmitReply = (data: IdeaCommentFormData) => {
    replyMutation.mutate({ ...data, ideaId, inReplyToCommentId: comment.id });
  };

  // このコメントの返信元コメントにスクロールする
  const handleScrollReplySource = async () => {
    if (comment.inReplyToComment) {
      window.location.hash = comment.inReplyToComment.id;
    }
  };

  return (
    <Stack gap="xs" ref={commentRef}>
      <Card id={comment.id} pos="static" className={classes.root}>
        <Stack gap="md">
          <Flex gap="0" justify="space-between">
            <Flex gap="xs" align="flex-start">
              <UserIconLink
                userId={comment.fromUser.id}
                iconSrc={comment.fromUser.image}
              />
              <Box>
                {comment.fromUser.id === ideaOwnerId && (
                  <Flex gap={3} align="center">
                    <SvgUser
                      width={18}
                      height={18}
                      fill="var(--mantine-color-red-7)"
                      color="var(--mantine-color-red-7)"
                    />
                    <Text c="red.7" size="xs">
                      お題の投稿者
                    </Text>
                  </Flex>
                )}
                <Text size="xs">{comment.fromUser.name}</Text>
              </Box>
            </Flex>
            <Box>
              <IdeaCommentMenuButton
                ideaId={ideaId}
                commentId={comment.id}
                isOwner={isOwner}
                onDeleteComment={handleDelete}
                isDeleting={isDeleting}
              />
            </Box>
          </Flex>
          {/* 返信コメントは返信元が削除されている場合はnullになる */}
          {comment.inReplyToComment === null && (
            <Box color="red.7" className={classes["deleted-message"]}>
              <SvgChevronsRight width={20} height={20} />
              削除されたコメント
            </Box>
          )}
          {comment.inReplyToComment && (
            <Flex>
              <UnstyledButton
                onClick={handleScrollReplySource}
                color="red.7"
                className={classes["replay-message"]}
              >
                <SvgChevronsRight width={20} height={20} />
                {comment.inReplyToComment.fromUserName ?? "不明なユーザー名"}
              </UnstyledButton>
            </Flex>
          )}
          <AppLinkify>
            <Text className={classes.comment}>{comment.text}</Text>
          </AppLinkify>
          <Flex justify="space-between" align="center" gap="xs">
            <Flex align="center">
              <CardActionIcon c="gray.5" onClick={handleOpenReplyForm}>
                <SvgMessageCircle width="70%" height="70%" />
              </CardActionIcon>
            </Flex>
            <MutedText>{formatDate(comment.createdAt)}</MutedText>
          </Flex>
        </Stack>
      </Card>
      {isReplyFormOpen && (
        <IdeaCommentReplyFormCard
          onCancel={closeReplyForm}
          onSubmit={handleSubmitReply}
          isSubmitting={replyMutation.isLoading}
        />
      )}
    </Stack>
  );
};
