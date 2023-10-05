import { stopPropagation } from "@/client/lib/utils";
import { ActionIcon, Flex, Text } from "@mantine/core";
import clsx from "clsx";
import { TbHeart } from "react-icons/tb";
import classes from "./DevMiniLikeButton.module.css";

type Props = {
  likes: number;
  likedByLoggedInUser: boolean;
  onClick: () => void;
  disabled?: boolean;
};
export const DevMiniLikeButton: React.FC<Props> = ({
  likes,
  likedByLoggedInUser,
  onClick,
  disabled,
}) => {
  return (
    <Flex align="center" onClick={stopPropagation}>
      <ActionIcon
        disabled={disabled}
        c={likedByLoggedInUser ? "pink" : undefined}
        size={30}
        onClick={onClick}
        className={clsx(classes.icon, { [classes.liked]: likedByLoggedInUser })}
      >
        {likedByLoggedInUser ? (
          <TbHeart
            size="78%"
            color="transparent"
            fill="var(--mantine-color-pink-7)"
          />
        ) : (
          <TbHeart size="75%" color="var(--mantine-color-gray-7)" />
        )}
      </ActionIcon>
      <Text>{likes}</Text>
    </Flex>
  );
};
