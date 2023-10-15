import { DeveloperTitle } from "@/client/features/dev/DeveloperTitle/DeveloperTitle";
import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { UserSection } from "@/client/features/user/UserSection/UserSection";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Flex, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { TbFileText, TbHeart } from "react-icons/tb";
import classes from "./LikedDevCard.module.css";

type Props = { dev: Dev };

/**
 * いいねした開発情報を表示するカード
 *
 */
export const LikedDevCard: React.FC<Props> = ({ dev }) => {
  const router = useRouter();

  const handleGoDevDetail = () => {
    router.push(Routes.dev(dev.ideaId, dev.id));
  };

  return (
    <>
      <ItemCard
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
          <Group align="center" gap={5} mt={5}>
            <TbFileText color="var(--mantine-color-gray-5)" size={25} />
            <TextLink href={Routes.idea(dev.ideaId)}>
              <MutedText>{dev.ideaTitle}</MutedText>
            </TextLink>
          </Group>
        }
        rightFooter={
          <Flex align="center" gap={3}>
            <TbHeart
              color="var(--mantine-color-pink-7)"
              fill="var(--mantine-color-pink-7)"
              size={20}
            />
            <Text size="sm">{dev.likes}</Text>
          </Flex>
        }
      >
        <UserSection
          userIconSrc={dev.developer.imageUrl}
          userId={dev.developer.id}
          title={<DeveloperTitle dev={dev} className={classes["dev-link"]} />}
        />
      </ItemCard>
    </>
  );
};
