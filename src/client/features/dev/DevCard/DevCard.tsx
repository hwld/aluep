import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevMiniLikeButton } from "@/client/features/dev/DevMiniLikeButton/DevMiniLikeButton";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { formatDate } from "@/client/lib/utils";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Box, Card, Flex, Text } from "@mantine/core";
import { useRouter } from "next/router";
import classes from "./DevCard.module.css";

type Props = {
  idea: Idea;
  dev: Dev;
  onLikeDev: (devId: string) => void;
  onUnlikeDev: (devId: string) => void;
};

export const devCardMinWidthPx = 450;

export const DevCard: React.FC<Props> = ({
  idea,
  dev,
  onLikeDev: onLike,
  onUnlikeDev: onUnlike,
}) => {
  const router = useRouter();
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  const handleLikeDev = () => {
    //ログインしていなければログインモーダルを表示させる
    if (!session) {
      openLoginModal();
      return;
    }

    if (dev.likedByLoggedInUser) {
      onUnlike(dev.id);
    } else {
      onLike(dev.id);
    }
  };

  const handleGoDevDetail = () => {
    router.push(Routes.dev(idea.id, dev.id));
  };

  // 開発者自身でなければいいねできる
  const canLike = dev.developer.id !== session?.user.id;

  return (
    <Card
      p="sm"
      miw={devCardMinWidthPx}
      className={classes.root}
      onClick={handleGoDevDetail}
    >
      <Flex justify="space-between">
        <DevStatusBadge status={dev.status} />
        <Flex>
          <GitHubCodeIconLink gitHubUrl={dev.githubUrl} />
          {dev.developedItemUrl && (
            <DevItemIconLink url={dev.developedItemUrl} />
          )}
        </Flex>
      </Flex>
      <Flex justify="space-between">
        <Flex gap="xs">
          <UserIconLink
            iconSrc={dev.developer.imageUrl}
            userId={dev.developer.id}
          />
          <TextLink
            href={Routes.dev(idea.id, dev.id)}
            className={classes["dev-link"]}
          >
            <Text fw="bold" size="lg">
              {dev.developer.name}
              <Text span c="gray.5" size="sm" fw="normal">
                {" の開発"}
              </Text>
            </Text>
          </TextLink>
        </Flex>
      </Flex>
      <Flex align="center" justify="space-between">
        <Text size="sm" c="gray.5">
          開発開始日: {formatDate(new Date(dev.createdAt))}
        </Text>
        <Box>
          <DevMiniLikeButton
            likes={dev.likes}
            likedByLoggedInUser={dev.likedByLoggedInUser}
            onClick={handleLikeDev}
            disabled={!canLike}
          />
        </Box>
      </Flex>
    </Card>
  );
};
