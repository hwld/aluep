import {
  ActionIcon,
  Card,
  Flex,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsGithub } from "react-icons/bs";
import { TbFileText, TbHeart } from "react-icons/tb";
import { Development } from "../../../server/models/development";
import { Routes } from "../../../share/routes";
import { TextLink } from "../../ui/TextLink";
import { UserIconLink } from "../user/UserIconLink";
import { DevelopmentStatusBadge } from "./DevelopmentCard/DevelopmentStatusBadge";

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
        <Tooltip
          label="コードを見に行く"
          position="top"
          withArrow
          transition="pop"
        >
          {/* TODO: 共通化できないかな */}
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
      <Flex gap="xs" justify="space-between" align="flex-end">
        <Flex>
          <UserIconLink
            iconSrc={development.image}
            userId={development.userId}
          />
          <Stack spacing={0}>
            <TextLink
              href={Routes.development(development.ideaId, development.id)}
              className="development-link"
            >
              <Text fw="bold" size="lg">
                {development.name}
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
