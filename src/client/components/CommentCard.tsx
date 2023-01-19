import { Card } from "@mantine/core";
import { ThemeComment } from "../../server/models/themeComment";

type Props = { comment: ThemeComment };
export const CommentCard: React.FC<Props> = ({ comment }) => {
  return <Card>{comment.comment}</Card>;
};
