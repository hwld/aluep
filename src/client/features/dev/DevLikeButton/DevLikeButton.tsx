import { useDevLikeOnDetail } from "@/client/features/dev/useDevLikeOnDetail";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { stopPropagation } from "@/client/lib/utils";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { ActionIcon, Flex, Text } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import clsx from "clsx";
import classes from "./DevLikeButton.module.css";

type Props = {
  dev: Dev;
  disabled?: boolean;
};
export const DevLikeButton: React.FC<Props> = ({ dev, disabled }) => {
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();
  const { likeDevMutation, unlikeDevMutation } = useDevLikeOnDetail(dev.id);

  const handleToggleDevLike = () => {
    if (!session) {
      openLoginModal();
      return;
    }

    if (dev.likedByLoggedInUser) {
      unlikeDevMutation.mutate({ devId: dev.id });
    } else {
      likeDevMutation.mutate({ devId: dev.id });
    }
  };

  return (
    <Flex align="center" onClick={stopPropagation} gap="xs">
      <ActionIcon
        disabled={disabled}
        color={dev.likedByLoggedInUser ? "pink" : undefined}
        size={50}
        onClick={handleToggleDevLike}
        className={clsx(classes.root, {
          [classes.liked]: dev.likedByLoggedInUser,
        })}
      >
        {dev.likedByLoggedInUser ? (
          <IconHeartFilled
            className={clsx(classes["like-icon"], classes.liked)}
          />
        ) : (
          <IconHeart className={clsx(classes["like-icon"])} />
        )}
      </ActionIcon>
      <TextLink href={Routes.devLikers(dev.id)} disabled={dev.likes === 0}>
        <Text size="xl" fw="bold">
          {dev.likes}
        </Text>
      </TextLink>
    </Flex>
  );
};
