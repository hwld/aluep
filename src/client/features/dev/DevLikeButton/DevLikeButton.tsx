import { stopPropagation } from "@/client/lib/utils";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Routes } from "@/share/routes";
import { ActionIcon, Flex, Text } from "@mantine/core";
import clsx from "clsx";
import { TbHeart } from "react-icons/tb";
import classes from "./DevLikeButton.module.css";

type Props = {
  ideaId: string;
  developmentId: string;
  likes: number;
  likedByLoggedInUser: boolean;
  onToggleIdeaLike: () => void;
  disabled?: boolean;
};
export const DevLikeButton: React.FC<Props> = ({
  ideaId,
  developmentId,
  likes,
  likedByLoggedInUser,
  onToggleIdeaLike,
  disabled,
}) => {
  return (
    <Flex align="center" onClick={stopPropagation} gap="xs">
      <ActionIcon
        disabled={disabled}
        color={likedByLoggedInUser ? "pink" : undefined}
        size={50}
        onClick={onToggleIdeaLike}
        className={clsx(classes.root, { [classes.liked]: likedByLoggedInUser })}
      >
        <TbHeart
          className={clsx(classes["like-icon"], {
            [classes.liked]: likedByLoggedInUser,
          })}
        />
      </ActionIcon>
      <TextLink
        href={Routes.developmentLikers(ideaId, developmentId)}
        disabled={likes === 0}
      >
        <Text size="xl" fw="bold">
          {likes}
        </Text>
      </TextLink>
    </Flex>
  );
};
