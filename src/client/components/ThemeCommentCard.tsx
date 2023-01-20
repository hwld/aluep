import { Box, Card, Flex, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { BiTrashAlt } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { ThemeComment } from "../../server/models/themeComment";
import { ThemeCommentFormData } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { CardActionIcon } from "../CardActionIcon";
import { AppConfirmModal } from "./AppConfirmModal";
import { ThemeCommentReplyForm } from "./ThemeCommentReplyForm";
import { UserIconLink } from "./UserIconLink";

type Props = {
  comment: ThemeComment;
  inReplyToUserName?: string;
  onReplyComment: (
    data: OmitStrict<ThemeCommentFormData, "themeId">,
    onSuccess: () => void
  ) => void;
  onDeleteComment: (id: string) => void;
  isDeleting?: boolean;
  loggedInUserId?: string;
};
export const ThemeCommentCard: React.FC<Props> = ({
  comment,
  inReplyToUserName,
  onReplyComment,
  onDeleteComment,
  isDeleting = false,
  loggedInUserId,
}) => {
  const [
    isDeleteModalOpen,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const [isReplyFormOpen, { close: closeReplyForm, open: openReplyForm }] =
    useDisclosure(false);

  const handleDelete = () => {
    onDeleteComment(comment.id);
  };

  const handleSubmitReply = (
    data: OmitStrict<ThemeCommentFormData, "themeId">
  ) => {
    // 返信が成功した場合、ReplyFormを削除する
    onReplyComment(data, () => {
      closeReplyForm();

      // 一番下までスクロールさせる
      // TODO: コメントが画面に反映される前にスクロールされてしまう。
      const element = document.documentElement;
      window.scroll(0, element.scrollHeight - element.clientHeight);
    });
  };

  return (
    <>
      <Stack spacing="xs">
        <Card id={comment.id}>
          <Stack spacing="xs">
            <Flex gap="xs">
              <UserIconLink
                userId={comment.fromUser.id}
                iconSrc={comment.fromUser.image}
              />
              <Text>{comment.fromUser.name}</Text>
            </Flex>
            {/* 返信コメントだが、返信元が削除されている場合はnullになる */}
            {comment.inReplyToCommentId === null && (
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
            {comment.inReplyToCommentId && inReplyToUserName !== undefined && (
              <Flex>
                <Box
                  component={Link}
                  href={`#${comment.inReplyToCommentId}`}
                  replace
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
                  {inReplyToUserName}
                </Box>
              </Flex>
            )}
            <Text>{comment.comment}</Text>
            <Flex justify="space-between" align="center" gap="xs">
              <Flex align="center">
                <CardActionIcon color="gray.5" onClick={openReplyForm}>
                  <FaRegComment size="70%" />
                </CardActionIcon>
                {loggedInUserId === comment.fromUser.id && (
                  <CardActionIcon color="gray.5" onClick={openDeleteModal}>
                    <BiTrashAlt size="80%" />
                  </CardActionIcon>
                )}
              </Flex>
              <Text c="gray.5">{comment.createdAt.toLocaleString()}</Text>
            </Flex>
          </Stack>
        </Card>
        {isReplyFormOpen && (
          <Card>
            <Flex justify="flex-end" mb="sm">
              <CardActionIcon onClick={closeReplyForm}>
                <MdClose size="80%" />
              </CardActionIcon>
            </Flex>
            <ThemeCommentReplyForm
              inReplyToCommentId={comment.id}
              themeId={comment.themeId}
              onCancel={closeReplyForm}
              onSubmit={handleSubmitReply}
              isSubmitting={false}
            />
          </Card>
        )}
      </Stack>
      <AppConfirmModal
        title="コメントの削除"
        message={<>コメントを削除してもよろしいですか？</>}
        opened={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        confirmIcon={BiTrashAlt}
        confirmText="削除する"
      />
    </>
  );
};
