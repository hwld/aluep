import { IdeaCommentMenuButton } from "@/client/features/ideaComment/IdeaCommentMenuButton/IdeaCommentMenuButton";
import { IdeaCommentReplyFormCard } from "@/client/features/ideaComment/IdeaCommentReplyFormCard/IdeaCommentReplyFormCard";
import { useIdeaCommentReply } from "@/client/features/ideaComment/useIdeaCommentReply";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink";
import { useHashRemoverOnClickOutside } from "@/client/lib/useHashRemoverOnClickOutside";
import { formatDate } from "@/client/lib/utils";
import { CardActionIcon } from "@/client/ui/CardActionIcon/CardActionIcon";
import { IdeaComment, IdeaCommentFormData } from "@/models/ideaComment";
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
            <Box color="red.7" className={classes["deleted-message"]}>
              <HiOutlineChevronDoubleRight />
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
                <HiOutlineChevronDoubleRight />
                {comment.inReplyToComment.fromUserName ?? "不明なユーザー名"}
              </UnstyledButton>
            </Flex>
          )}
          <Text className={classes.comment}>{comment.text}</Text>
          <Flex justify="space-between" align="center" gap="xs">
            <Flex align="center">
              <CardActionIcon c="gray.5" onClick={handleOpenReplyForm}>
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
