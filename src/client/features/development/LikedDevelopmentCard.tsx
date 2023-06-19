import { Card, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { TbFileText, TbHeart } from "react-icons/tb";
import { Development } from "../../../server/models/development";
import { Routes } from "../../../share/routes";
import { GitHubCodeIconLink } from "../../ui/GitHubCodeIconLink";
import { TextLink } from "../../ui/TextLink";
import { UserIconLink } from "../user/UserIconLink";
import { DevelopedItemIconLink } from "./DevelopedItemIconLink";
import { DevelopmentStatusBadge } from "./DevelopmentStatusBadge";

type Props = { development: Development };

/**
 * いいねした開発情報を表示するカード
 *
 */
export const LikedDevelopmentCard: React.FC<Props> = ({ development }) => {
  const { colors } = useMantineTheme();
  const router = useRouter();

  const handleGoDevelopmentDetail = () => {
    router.push(Routes.development(development.ideaId, development.id));
  };

  return (
    <Card
      sx={(theme) => ({
        cursor: "pointer",
        transition: "outline 100ms",
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
        <Flex>
          <GitHubCodeIconLink gitHubUrl={development.githubUrl} />
          {development.developedItemUrl !== "" && (
            <DevelopedItemIconLink url={development.developedItemUrl} />
          )}
        </Flex>
      </Flex>
      <Flex gap="xs" justify="space-between" align="flex-end">
        <Flex gap="xs">
          <UserIconLink
            iconSrc={development.developerUserImage}
            userId={development.developerUserId}
          />
          <Stack spacing={0}>
            <TextLink
              href={Routes.development(development.ideaId, development.id)}
              className="development-link"
            >
              <Text fw="bold" size="lg">
                {development.developerUserName}
                <Text span c="gray.5" size="sm" fw="normal">
                  {" の開発"}
                </Text>
              </Text>
            </TextLink>
            <Flex align="center" gap={5} mt={5}>
              <TbFileText color={colors.gray[5]} size={25} />
              <TextLink href={Routes.idea(development.ideaId)}>
                <Text c="gray.5" size="sm">
                  {development.ideaTitle}
                </Text>
              </TextLink>
            </Flex>
          </Stack>
        </Flex>
        <Flex align="center" gap={3}>
          <TbHeart color={colors.pink[7]} fill={colors.pink[7]} size={20} />
          <Text size="sm">{development.likes}</Text>
        </Flex>
      </Flex>
    </Card>
  );
};
