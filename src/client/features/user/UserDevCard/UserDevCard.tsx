import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { formatDate } from "@/client/lib/utils";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Card, Flex, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { TbHeart } from "react-icons/tb";
import classes from "./UserDevCard.module.css";

export const userDevCardMinWidthPx = 450;

type Props = {
  dev: Dev;
};

/**
 * ユーザーが開発したお題と開発情報を表示するカード
 */
export const UserDevCard: React.FC<Props> = ({ dev }) => {
  const router = useRouter();

  const handleGoDevDetail = () => {
    router.push(Routes.dev(dev.ideaId, dev.id));
  };

  return (
    <Card
      key={dev.id}
      miw={userDevCardMinWidthPx}
      className={classes.root}
      onClick={handleGoDevDetail}
    >
      <Flex justify="space-between" align="center">
        <DevStatusBadge status={dev.status} />
        <Flex>
          <GitHubCodeIconLink gitHubUrl={dev.githubUrl} />
          {dev.developedItemUrl !== "" && (
            <DevItemIconLink url={dev.developedItemUrl} />
          )}
        </Flex>
      </Flex>
      <Flex justify="space-between" mt="xs">
        <Flex gap={10}>
          <TextLink href={Routes.dev(dev.ideaId, dev.id)} className="dev-link">
            <Text c="red.7" fw="bold" size="lg">
              {dev.ideaTitle}
              <Text span c="gray.5" size="sm" fw="normal">
                の開発情報
              </Text>
            </Text>
          </TextLink>
        </Flex>
      </Flex>
      <Flex align="center" justify="space-between" mt="xs" ml="xs">
        <Text size="sm" c="gray.5">
          開発開始日: {formatDate(new Date(dev.createdAt))}
        </Text>
        <Flex align="center" gap={3}>
          <TbHeart size="20px" color="var(--mantine-color-red-7)" />
          <Text size="sm" c="red.7">
            {dev.likes}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};
