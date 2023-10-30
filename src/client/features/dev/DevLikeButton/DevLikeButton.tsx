import { stopPropagation } from "@/client/lib/utils";
import { SvgHeart, SvgHeartFilled } from "@/client/ui/Icons";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Routes } from "@/share/routes";
import { ActionIcon, Flex, Text } from "@mantine/core";
import clsx from "clsx";
import classes from "./DevLikeButton.module.css";

type Props = {
  devId: string;
  likes: number;
  likedByLoggedInUser: boolean;
  onToggleIdeaLike: () => void;
  disabled?: boolean;
};
export const DevLikeButton: React.FC<Props> = ({
  devId,
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
        {likedByLoggedInUser ? (
          <SvgHeartFilled
            className={clsx(classes["like-icon"], classes.liked)}
          />
        ) : (
          <SvgHeart className={clsx(classes["like-icon"])} />
        )}
      </ActionIcon>
      <TextLink href={Routes.devLikers(devId)} disabled={likes === 0}>
        <Text size="xl" fw="bold">
          {likes}
        </Text>
      </TextLink>
    </Flex>
  );
};
