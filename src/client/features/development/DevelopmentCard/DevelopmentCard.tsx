import { Box, Card, Flex, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { Development } from "../../../../server/models/development";
import { Idea } from "../../../../server/models/idea";
import { Routes } from "../../../../share/routes";
import { formatDate } from "../../../lib/utils";
import { GitHubCodeButton } from "../../../ui/GitHubCodeButton";
import { TextLink } from "../../../ui/TextLink";
import { useRequireLoginModal } from "../../session/RequireLoginModalProvider";
import { useSessionQuery } from "../../session/useSessionQuery";
import { UserIconLink } from "../../user/UserIconLink";
import { DevelopmentMiniLikeButton } from "./DevelopmentMiniLikeButton";
import { DevelopmentStatusBadge } from "./DevelopmentStatusBadge";

type Props = {
  idea: Idea;
  development: Development;
  onLikeDevelopment: (developmentId: string) => void;
  onUnlikeDevelopment: (developmentId: string) => void;
};

export const developmentCardMinWidthPx = 450;

export const DevelopmentCard: React.FC<Props> = ({
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
        <GitHubCodeButton gitHubUrl={development.githubUrl} />
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
          <DevelopmentMiniLikeButton
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
