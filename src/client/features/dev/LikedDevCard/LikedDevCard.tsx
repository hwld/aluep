import { DevItemIconLink } from "@/client/features/dev/DevItemIconLink/DevItemIconLink";
import { DevStatusBadge } from "@/client/features/dev/DevStatusBadge/DevStatusBadge";
import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { GitHubCodeIconLink } from "@/client/ui/GitHubCodeIconLink/GitHubCodeIconLink";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Development } from "@/models/development";
import { Routes } from "@/share/routes";
import { Card, Flex, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { TbFileText, TbHeart } from "react-icons/tb";
import classes from "./LikedDevCard.module.css";

type Props = { development: Development };

/**
 * いいねした開発情報を表示するカード
 *
 */
export const LikedDevCard: React.FC<Props> = ({ development }) => {
  const router = useRouter();

  const handleGoDevelopmentDetail = () => {
    router.push(Routes.development(development.ideaId, development.id));
  };

  return (
    <Card className={classes.root} onClick={handleGoDevelopmentDetail}>
      <Flex justify="space-between">
        <DevStatusBadge status={development.status} />
        <Flex>
          <GitHubCodeIconLink gitHubUrl={development.githubUrl} />
          {development.developedItemUrl !== "" && (
            <DevItemIconLink url={development.developedItemUrl} />
          )}
        </Flex>
      </Flex>
      <Flex gap="xs" justify="space-between" align="flex-end">
        <Flex gap="xs">
          <UserIconLink
            iconSrc={development.developer.imageUrl}
            userId={development.developer.id}
          />
          <Stack gap={0}>
            <TextLink
              href={Routes.development(development.ideaId, development.id)}
              className={classes["development-link"]}
            >
              <Text fw="bold" size="lg">
                {development.developer.name}
                <Text span c="gray.5" size="sm" fw="normal">
                  {" の開発"}
                </Text>
              </Text>
            </TextLink>
            <Flex align="center" gap={5} mt={5}>
              <TbFileText color="var(--mantine-color-gray-5)" size={25} />
              <TextLink href={Routes.idea(development.ideaId)}>
                <Text c="gray.5" size="sm">
                  {development.ideaTitle}
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
          <Text size="sm">{development.likes}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};
