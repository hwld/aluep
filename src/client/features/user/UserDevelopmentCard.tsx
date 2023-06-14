import { Card, Flex, Text, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { TbHeart } from "react-icons/tb";
import { DevelopmentStatus } from "../../../server/models/developmentStatus";
import { Routes } from "../../../share/routes";
import { formatDate } from "../../lib/utils";
import { GitHubCodeButton } from "../../ui/GitHubCodeButton";
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
        transition: "all 100ms",
        outline: "transparent solid 0px",
        "&:not(:has(a:not(.development-link):hover, button:hover)):hover": {
          outline: `${theme.colors.red[6]} solid 2px`,
          outlineOffset: "2px",
        },
      })}
      onClick={handleGoDevelopmentDetail}
    >
      <Flex justify="space-between" align="center">
        <DevelopmentStatusBadge status={developmentStatus} />
        <GitHubCodeButton gitHubUrl={githubUrl} />
      </Flex>
      <Flex justify="space-between" mt="xs">
        <Flex gap={10}>
          <TextLink
            href={Routes.development(ideaId, developmentId)}
            className="development-link"
          >
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
