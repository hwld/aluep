import {
  ActionIcon,
  Card,
  Flex,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsGithub } from "react-icons/bs";
import { TbHeart } from "react-icons/tb";
import { DevelopmentStatus } from "../../../server/models/developmentStatus";
import { Routes } from "../../../share/routes";
import { formatDate, stopPropagation } from "../../lib/utils";
import { TextLink } from "../../ui/TextLink";
import { DevelopmentStatusBadge } from "../development/DevelopmentCard/DevelopmentStatusBadge";

export const userDevelopmentCardMinWidthPx = 450;

export type UserDevelopment = {
  ideaId: string;
  ideaTitle: string;
  developmentId: string;
  developerId: string;
  developmentStatus: DevelopmentStatus;
  githubUrl: string;
  developmentLikes: number;
  createdAt: string;
};

type Props = {
  userDevelopment: UserDevelopment;
};

/**
 * ユーザーが開発したお題と開発情報を表示するカード
 */
export const UserDevelopmentCard: React.FC<Props> = ({
  userDevelopment: {
    ideaId,
    ideaTitle,
    developmentId,
    developmentStatus,
    githubUrl,
    developmentLikes,
    createdAt,
  },
}) => {
  const router = useRouter();
  const { colors } = useMantineTheme();

  const handleGoDevelopmentDetail = () => {
    router.push(Routes.development(ideaId, developmentId));
  };

  return (
    <Card
      key={developmentId}
      p="sm"
      miw={userDevelopmentCardMinWidthPx}
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
      <Flex justify="space-between" align="center">
        <DevelopmentStatusBadge status={developmentStatus} />
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
              href={githubUrl.replace(/^(https:\/\/github)(.com)/, "$11s$2")}
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
      <Flex justify="space-between" mt="xs">
        <Flex gap={10}>
          <TextLink href={Routes.development(ideaId, developmentId)}>
            <Text c="red.7" fw="bold" size="lg">
              {ideaTitle}
              <Text span c="gray.5" size="sm" fw="normal">
                の開発情報
              </Text>
            </Text>
          </TextLink>
        </Flex>
      </Flex>
      <Flex align="center" justify="space-between" mt="xs" ml="xs">
        <Text size="sm" color="gray.5">
          開発開始日: {formatDate(new Date(createdAt))}
        </Text>
        <Flex align="center" gap={3}>
          <TbHeart size="20px" color={colors.red[7]} />
          <Text size="sm" c="red.7">
            {developmentLikes}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};
