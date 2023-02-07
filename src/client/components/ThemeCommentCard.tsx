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
import { BiTrashAlt } from "react-icons/bi";
import { FaRegComment, FaUserAlt } from "react-icons/fa";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { ThemeComment } from "../../server/models/themeComment";
import { ThemeCommentFormData } from "../../share/schema";
import { OmitStrict } from "../../types/OmitStrict";
import { CardActionIcon } from "../CardActionIcon";
import { useRequireLoginModal } from "../contexts/RequireLoginModalProvider";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { formatDate } from "../utils";
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
  themeOwnerId: string;
};
export const ThemeCommentCard: React.FC<Props> = ({
  comment,
  inReplyToUserName,
  onReplyComment,
  onDeleteComment,
  isDeleting = false,
  loggedInUserId,
  themeOwnerId,
}) => {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();
  const [
    isDeleteModalOpen,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);
  const mantineTheme = useMantineTheme();

  const [isReplyFormOpen, { close: closeReplyForm, open: openReplyForm }] =
    useDisclosure(false);

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

  // このコメントの返信元コメントにスクロールする
  // #[comment.inReplyToCommentId]に遷移させることもできるが、リロードしたときに
  // そのコメントまでスクロールさせたくないのでElementを直接触る。
  const handleScrollReplySource = () => {
    if (comment.inReplyToCommentId) {
      const element = document.querySelector(`#${comment.inReplyToCommentId}`);
      element?.scrollIntoView();
    }
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
              <Box>
                {comment.fromUser.id === themeOwnerId && (
                  <Flex gap={5} align="center">
                    <FaUserAlt size={14} fill={mantineTheme.colors.red[7]} />
                    <Text color="red.7" size="xs">
                      投稿者
                    </Text>
                  </Flex>
                )}
                <Text>{comment.fromUser.name}</Text>
              </Box>
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
                  {inReplyToUserName}
                </UnstyledButton>
              </Flex>
            )}
            <Text>{comment.comment}</Text>
            <Flex justify="space-between" align="center" gap="xs">
              <Flex align="center">
                <CardActionIcon color="gray.5" onClick={handleOpenReplyForm}>
                  <FaRegComment size="70%" />
                </CardActionIcon>
                {loggedInUserId === comment.fromUser.id && (
                  <CardActionIcon color="gray.5" onClick={openDeleteModal}>
                    <BiTrashAlt size="80%" />
                  </CardActionIcon>
                )}
              </Flex>
              <Text c="gray.5">{formatDate(comment.createdAt)}</Text>
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
