import { Button, Card, Flex, Text } from "@mantine/core";
import { ThemeComment } from "../../server/models/themeComment";
import { UserIconLink } from "./UserIconLink";

type Props = {
  comment: ThemeComment;
  onDeleteComment: (id: string) => void;
  loggedInUserId?: string;
};
export const CommentCard: React.FC<Props> = ({
  comment,
  onDeleteComment,
  loggedInUserId,
}) => {
  const handleDelete = () => {
    onDeleteComment(comment.id);
  };

  return (
    <Card>
      <Flex gap="xs">
        <UserIconLink
          userId={comment.fromUser.id}
          iconSrc={comment.fromUser.image}
        />
        <Text>{comment.fromUser.name}</Text>
      </Flex>
      <Text>{comment.comment}</Text>
      <Text>{comment.createdAt.toLocaleString()}</Text>
      {loggedInUserId === comment.fromUser.id && (
        <Button onClick={handleDelete}>削除</Button>
      )}
    </Card>
  );
};
