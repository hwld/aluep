import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { formatDate } from "@/client/lib/utils";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Development } from "@/models/development";
import { Routes } from "@/share/routes";
import { Card, Flex, Text, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { TbHeart } from "react-icons/tb";
import classes from "./UserDevelopmentCard.module.css";

export const userDevelopmentCardMinWidthPx = 450;

type Props = {
  development: Development;
};

/**
 * ユーザーが開発したお題と開発情報を表示するカード
 */
export const UserDevelopmentCard: React.FC<Props> = ({ development }) => {
  const router = useRouter();
  const { colors } = useMantineTheme();

  const handleGoDevelopmentDetail = () => {
    router.push(Routes.development(development.ideaId, development.id));
  };

  return (
    <Card
      key={development.id}
      miw={userDevelopmentCardMinWidthPx}
      className={classes.root}
      onClick={handleGoDevelopmentDetail}
    >
      <Flex justify="space-between" align="center">
        <DevStatusBadge status={development.status} />
        <Flex>
          <GitHubCodeIconLink gitHubUrl={development.githubUrl} />
          {development.developedItemUrl !== "" && (
            <DevItemIconLink url={development.developedItemUrl} />
          )}
        </Flex>
      </Flex>
      <Flex justify="space-between" mt="xs">
        <Flex gap={10}>
          <TextLink
            href={Routes.development(development.ideaId, development.id)}
            className="development-link"
          >
            <Text c="red.7" fw="bold" size="lg">
              {development.ideaTitle}
              <Text span c="gray.5" size="sm" fw="normal">
                の開発情報
              </Text>
            </Text>
          </TextLink>
        </Flex>
      </Flex>
      <Flex align="center" justify="space-between" mt="xs" ml="xs">
        <Text size="sm" c="gray.5">
          開発開始日: {formatDate(new Date(development.createdAt))}
        </Text>
        <Flex align="center" gap={3}>
          <TbHeart size="20px" color={colors.red[7]} />
          <Text size="sm" c="red.7">
            {development.likes}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};