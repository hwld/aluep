import { useIdeaLike } from "@/client/features/idea/useIdeaLike";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { AnimationLikeIcon } from "@/client/ui/AnimationLikeIcon/AnimationLikeIcon";
import { Routes } from "@/share/routes";
import { ActionIcon, Anchor, Stack, Tooltip } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import classes from "./IdeaLikeButton.module.css";

type Props = {
  likes: number;
  likedByLoggedInUser: boolean;
  disabled?: boolean;
  ideaId: string;
};
export const IdeaLikeButton: React.FC<Props> = ({
  likes,
  likedByLoggedInUser,
  disabled,
  ideaId,
}) => {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();
  const { likeIdeaMutation, unlikeIdeaMutation } = useIdeaLike({ ideaId });

  const toggleLikeIdea = () => {
    //ログインしていなければログインモーダルを表示する
    if (!session) {
      openLoginModal();
      return;
    }

    if (likedByLoggedInUser) {
      unlikeIdeaMutation.mutate({ ideaId });
    } else {
      likeIdeaMutation.mutate({ ideaId });
    }
  };

  return (
    <Stack align="center" gap={3}>
      <ActionIcon
        disabled={disabled}
        size={50}
        className={clsx(classes["like-button"], {
          [classes.liked]: likedByLoggedInUser,
        })}
        onClick={toggleLikeIdea}
        pt={5}
      >
        <AnimationLikeIcon
          liked={likedByLoggedInUser}
          width="80%"
          height="80%"
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
