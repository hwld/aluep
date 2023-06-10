import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsGithub } from "react-icons/bs";
import { Development } from "../../../../server/models/development";
import { Idea } from "../../../../server/models/idea";
import { Routes } from "../../../../share/routes";
import { formatDate, stopPropagation } from "../../../lib/utils";
import { TextLink } from "../../../ui/TextLink";
import { useRequireLoginModal } from "../../session/RequireLoginModalProvider";
import { useSessionQuery } from "../../session/useSessionQuery";
import { UserIconLink } from "../../user/UserIconLink";
import { DevelopmentLikeButton } from "./DevelopmentLikeButton";
import { DevelopmentStatusBadge } from "./DevelopmentStatusBadge";

type Props = {
  idea: Idea;
  development: Development;
  onLikeDevelopment: (developmentId: string) => void;
  onUnlikeDevelopment: (developmentId: string) => void;
};

export const DevelopmentCard: React.FC<Props> = ({
  idea,
  development,
  onLikeDevelopment: onLike,
  onUnlikeDevelopment: onUnlike,
}) => {
  const router = useRouter();
  const { colors } = useMantineTheme();
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
  const canLike = development.userId !== session?.user.id;

  return (
    <Card
      key={development.userId}
      p="sm"
      sx={(theme) => ({
        position: "static",
        cursor: "pointer",
        transition: "all 150ms",
        "&:not(:has(*[data-user-icon]:hover)):hover": {
          boxShadow: `${theme.shadows.lg}, 0 0 0 2px ${theme.colors.red[7]}`,
        },
      })}
      onClick={handleGoDevelopmentDetail}
    >
      <Flex justify="space-between">
        <DevelopmentStatusBadge status={development.status} />
        <Flex onClick={stopPropagation}>
          <Tooltip
            label="コードを見に行く"
            position="top"
            withArrow
            transition="pop"
          >
            <ActionIcon
              size={40}
              component={Link}
              // githubのURLをgithub1sに変換
              href={development.githubUrl.replace(
                /^(https:\/\/github)(.com)/,
                "$11s$2"
              )}
              target="_blank"
              sx={(theme) => ({
                transition: "all 200ms",
                "&:hover": {
                  backgroundColor: theme.fn.rgba(theme.colors.gray[7], 0.1),
                },
              })}
            >
              <BsGithub size="80%" fill={colors.gray[7]} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex justify="space-between">
        <Flex gap={10}>
          <UserIconLink
            iconSrc={development.image}
            userId={development.userId}
          />
          <TextLink href={Routes.development(idea.id, development.id)}>
            <Text fw="bold" size="lg">
              {development.name}
              <Text span c="gray.5" size="sm" fw="normal">
                の開発
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
          <DevelopmentLikeButton
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
