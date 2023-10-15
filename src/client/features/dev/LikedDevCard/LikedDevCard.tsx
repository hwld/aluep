import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Card, Flex, Stack, Text } from "@mantine/core";
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
    <Card className={classes.root} onClick={handleGoDevDetail}>
      <Flex justify="space-between">
        <DevStatusBadge status={dev.status} />
        <Flex>
          <GitHubCodeIconLink gitHubUrl={dev.githubUrl} />
          {dev.developedItemUrl !== "" && (
            <DevItemIconLink url={dev.developedItemUrl} />
          )}
        </Flex>
      </Flex>
      <Flex gap="xs" justify="space-between" align="flex-end">
        <Flex gap="xs">
          <UserIconLink
            iconSrc={dev.developer.imageUrl}
            userId={dev.developer.id}
          />
          <Stack gap={0}>
            <TextLink
              href={Routes.dev(dev.ideaId, dev.id)}
              className={classes["dev-link"]}
            >
              <Text fw="bold" size="lg">
                {dev.developer.name}
                <Text span c="gray.5" size="sm" fw="normal">
                  {" の開発"}
                </Text>
              </Text>
            </TextLink>
            <Flex align="center" gap={5} mt={5}>
              <TbFileText color="var(--mantine-color-gray-5)" size={25} />
              <TextLink href={Routes.idea(dev.ideaId)}>
                <Text c="gray.5" size="sm">
                  {dev.ideaTitle}
                </Text>
              </TextLink>
            </Flex>
          </Stack>
        </Flex>
        <Flex align="center" gap={3}>
          <TbHeart
            color="var(--mantine-color-pink[7]} fill={colors.pink-7)"
            size={20}
          />
          <Text size="sm">{dev.likes}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};
