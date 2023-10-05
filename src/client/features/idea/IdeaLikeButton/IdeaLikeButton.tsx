import { Routes } from "@/share/routes";
import {
  ActionIcon,
  Anchor,
  Stack,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import { TbHeart } from "react-icons/tb";
import classes from "./IdeaLikeButton.module.css";

type Props = {
  likes: number;
  likedByLoggedInUser: boolean;
  onLikeIdea: () => void;
  disabled?: boolean;
  ideaId: string;
};
export const IdeaLikeButton: React.FC<Props> = ({
  likes,
  likedByLoggedInUser,
  onLikeIdea,
  disabled,
  ideaId,
}) => {
  const { colors } = useMantineTheme();

  return (
    <Stack align="center" gap={3}>
      <ActionIcon
        disabled={disabled}
        color={likedByLoggedInUser ? "pink" : undefined}
        size={50}
        className={clsx(classes["like-button"], {
          [classes.liked]: likedByLoggedInUser,
        })}
        onClick={onLikeIdea}
      >
        <TbHeart
          {...(likedByLoggedInUser
            ? { size: "75%", color: "transparent", fill: colors.pink[7] }
            : { size: "70%", color: colors.gray[5] })}
          style={{ marginTop: "4px" }}
        />
      </ActionIcon>
      <Tooltip
        offset={10}
        label="いいねしたユーザーを表示する"
        position="right"
      >
        <Anchor
          component={Link}
          href={Routes.ideaLikers(ideaId)}
          size="sm"
          className={clsx(classes["like-count"], {
            [classes.link]: likes > 0,
            [classes.liked]: likedByLoggedInUser,
          })}
        >
          {likes}
        </Anchor>
      </Tooltip>
    </Stack>
  );
};
