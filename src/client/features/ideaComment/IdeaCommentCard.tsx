import { IdeaCommentMenuButton } from "@/client/features/ideaComment/IdeaCommentMenuButton";
import { IdeaCommentReplyFormCard } from "@/client/features/ideaComment/IdeaCommentReplyFormCard";
import { useIdeaCommentReply } from "@/client/features/ideaComment/useIdeaCommentReply";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { CardActionIcon } from "@/client/ui/CardActionIcon";
import { IdeaComment } from "@/server/models/ideaComment";
import { IdeaCommentFormData } from "@/share/schema/ideaComment";
import {
  Box,
  Card,
  Flex,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaRegComment, FaUserAlt } from "react-icons/fa";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

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
  const mantineTheme = useMantineTheme();

  const commentRef = useHashRemoverOnClickOutside({
    canRemove: (hash) => {
      return hash === comment.id;
    },
  });

  const [isReplyFormOpen, { close: closeReplyForm, open: openReplyForm }] =
    useDisclosure(false);

  const { replyMutation } = useIdeaCommentReply({
    ideaId,
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
    <Stack spacing="xs" ref={commentRef}>
      <Card
        id={comment.id}
        pos="static"
        sx={(theme) => ({
          "&:target": {
            boxShadow: `0 0 0 2px ${theme.colors.red[7]}`,
          },
        })}
      >
        <Stack spacing="md">
          <Flex gap="0" justify="space-between">
            <Flex gap="xs" align="flex-start">
              <UserIconLink
                userId={comment.fromUser.id}
                iconSrc={comment.fromUser.image}
              />
              <Box>
                {comment.fromUser.id === ideaOwnerId && (
                  <Flex gap={5} align="center">
                    <FaUserAlt size={14} fill={mantineTheme.colors.red[7]} />
                    <Text color="red.7" size="xs">
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
            <Box
              color="red.7"
              sx={(theme) => ({
                color: theme.colors.red[7],
                textDecoration: "none",
                display: "flex",
                gap: 3,
                alignItems: "center",
              })}
            >
              <HiOutlineChevronDoubleRight />
              削除されたコメント
            </Box>
          )}
          {comment.inReplyToComment && (
            <Flex>
              <UnstyledButton
                onClick={handleScrollReplySource}
                color="red.7"
                sx={(theme) => ({
                  color: theme.colors.red[7],
                  textDecoration: "none",
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                  "&:hover": {
                    color: theme.colors.red[9],
                  },
                })}
              >
                <HiOutlineChevronDoubleRight />
                {comment.inReplyToComment.fromUserName ?? "不明なユーザー名"}
              </UnstyledButton>
            </Flex>
          )}
          <Text sx={{ whiteSpace: "pre-wrap" }}>{comment.comment}</Text>
          <Flex justify="space-between" align="center" gap="xs">
            <Flex align="center">
              <CardActionIcon color="gray.5" onClick={handleOpenReplyForm}>
                <FaRegComment size="70%" />
              </CardActionIcon>
            </Flex>
            <Text c="gray.5">{formatDate(comment.createdAt)}</Text>
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
