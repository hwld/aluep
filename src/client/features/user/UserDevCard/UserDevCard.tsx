import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { formatDate } from "@/client/lib/utils";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Flex, Text } from "@mantine/core";
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
    <ItemCard
      miw={userDevCardMinWidthPx}
      className={classes.root}
      onClick={handleGoDevDetail}
      leftHeader={<DevStatusBadge status={dev.status} />}
      rightHeader={
        <Flex>
          <GitHubCodeIconLink gitHubUrl={dev.githubUrl} />
          {dev.developedItemUrl !== "" && (
            <DevItemIconLink url={dev.developedItemUrl} />
          )}
        </Flex>
      }
      leftFooter={
        <MutedText>開発開始日: {formatDate(new Date(dev.createdAt))}</MutedText>
      }
      rightFooter={
        // TODO: 共通化できそう
        <Flex align="center" gap={3}>
          <TbHeart size="20px" color="var(--mantine-color-red-7)" />
          <Text size="sm" c="red.7">
            {dev.likes}
          </Text>
        </Flex>
      }
    >
      <TextLink
        href={Routes.dev(dev.ideaId, dev.id)}
        className={classes["dev-link"]}
      >
        <Text c="red.7" fw="bold" size="lg">
          {dev.ideaTitle}
          <MutedText span>の開発情報</MutedText>
        </Text>
      </TextLink>
    </ItemCard>
  );
};
