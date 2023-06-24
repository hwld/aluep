import { DevelopedItemIconLink } from "@/client/features/development/DevelopedItemIconLink";
import { DevelopmentStatusBadge } from "@/client/features/development/DevelopmentStatusBadge";
import { IdeaDevelopmentMiniLikeButton } from "@/client/features/development/IdeaDevelopmentCard/IdeaDevelopmentMiniLikeButton";
import { useRequireLoginModal } from "@/client/features/session/RequireLoginModalProvider";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserIconLink } from "@/client/features/user/UserIconLink";
import { formatDate } from "@/client/lib/utils";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink";
import { TextLink } from "@/client/ui/TextLink";
import { Development } from "@/models/development";
import { Idea } from "@/models/idea";
import { Routes } from "@/share/routes";
import { Box, Card, Flex, Text } from "@mantine/core";
import { useRouter } from "next/router";

type Props = {
  idea: Idea;
  development: Development;
  onLikeDevelopment: (developmentId: string) => void;
  onUnlikeDevelopment: (developmentId: string) => void;
};

export const developmentCardMinWidthPx = 450;

export const IdeaDevelopmentCard: React.FC<Props> = ({
  idea,
  development,
  onLikeDevelopment: onLike,
  onUnlikeDevelopment: onUnlike,
}) => {
  const router = useRouter();
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  const handleLikeDevelopment = () => {
    //ログインしていなければログインモーダルを表示させる
    if (!session) {
      openLoginModal();
      return;
    }

    if (development.likedByLoggedInUser) {
      onUnlike(development.id);
    } else {
      onLike(development.id);
    }
  };

  const handleGoDevelopmentDetail = () => {
    router.push(Routes.development(idea.id, development.id));
  };

  // 開発者自身でなければいいねできる
  const canLike = development.developerUserId !== session?.user.id;

  return (
    <Card
      p="sm"
      miw={developmentCardMinWidthPx}
      sx={(theme) => ({
        position: "static",
        cursor: "pointer",
        transition: "all 100ms",
        outline: "transparent solid 0px",
        "&:not(:has(a:not(.development-link):hover, button:hover)):hover": {
          outline: `${theme.colors.red[6]} solid 2px`,
          outlineOffset: "3px",
        },
      })}
      onClick={handleGoDevelopmentDetail}
    >
      <Flex justify="space-between">
        <DevelopmentStatusBadge status={development.status} />
        <Flex>
          <GitHubCodeIconLink gitHubUrl={development.githubUrl} />
          {development.developedItemUrl && (
            <DevelopedItemIconLink url={development.developedItemUrl} />
          )}
        </Flex>
      </Flex>
      <Flex justify="space-between">
        <Flex gap={10}>
          <UserIconLink
            iconSrc={development.developerUserImage}
            userId={development.developerUserId}
          />
          <TextLink
            href={Routes.development(idea.id, development.id)}
            className="development-link"
          >
            <Text fw="bold" size="lg">
              {development.developerUserName}
              <Text span c="gray.5" size="sm" fw="normal">
                {" の開発"}
              </Text>
            </Text>
          </TextLink>
        </Flex>
      </Flex>
      <Flex align="center" justify="space-between" mt={5}>
        <Text size="sm" color="gray.5">
          開発開始日: {formatDate(new Date(development.createdAt))}
        </Text>
        <Box>
          <IdeaDevelopmentMiniLikeButton
            likes={development.likes}
            likedByLoggedInUser={development.likedByLoggedInUser}
            onClick={handleLikeDevelopment}
            disabled={!canLike}
          />
        </Box>
      </Flex>
    </Card>
  );
};
