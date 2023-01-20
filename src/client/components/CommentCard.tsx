import { Card, Flex, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiTrashAlt } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { ThemeComment } from "../../server/models/themeComment";
import { CardActionIcon } from "../CardActionIcon";
import { AppConfirmModal } from "./AppConfirmModal";
import { UserIconLink } from "./UserIconLink";

type Props = {
  comment: ThemeComment;
  onDeleteComment: (id: string) => void;
  isDeleting?: boolean;
  loggedInUserId?: string;
};
export const CommentCard: React.FC<Props> = ({
  comment,
  onDeleteComment,
  isDeleting = false,
  loggedInUserId,
}) => {
  const [
    isDeleteModalOpen,
    { close: closeDeleteModal, open: openDeleteModal },
  ] = useDisclosure(false);

  const handleDelete = () => {
    onDeleteComment(comment.id);
  };

  return (
    <>
      <Card>
        <Stack spacing="xs">
          <Flex gap="xs">
            <UserIconLink
              userId={comment.fromUser.id}
              iconSrc={comment.fromUser.image}
            />
            <Text>{comment.fromUser.name}</Text>
          </Flex>
          <Text>{comment.comment}</Text>
          <Flex justify="space-between" align="center" gap="xs">
            <Flex align="center">
              <CardActionIcon color="gray.5">
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
