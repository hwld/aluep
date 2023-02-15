import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsGithub } from "react-icons/bs";
import { Theme } from "../../../server/models/theme";
import { ThemeDeveloper } from "../../../server/models/themeDeveloper";
import { useRequireLoginModal } from "../../contexts/RequireLoginModalProvider";
import { useSessionQuery } from "../../hooks/useSessionQuery";
import { formatDate, stopPropagation } from "../../utils";
import { TextLink } from "../TextLink";
import { UserIconLink } from "../UserIconLink";
import { DeveloperLikeButton } from "./DeveloperLikeButton";

type Props = {
  theme: Theme;
  developer: ThemeDeveloper;
  onLikeDeveloper: (developerId: string, like: boolean) => void;
};

export const ThemeDeveloperCard: React.FC<Props> = ({
  theme,
  developer,
  onLikeDeveloper: onLike,
}) => {
  const router = useRouter();
  const mantineTheme = useMantineTheme();
  const { session } = useSessionQuery();
  const { openLoginModal } = useRequireLoginModal();

  const handleLikeDeveloper = () => {
    //ログインしていなければログインモーダルを表示させる
    if (!session) {
      openLoginModal();
      return;
    }
    onLike(developer.id, !developer.likedByLoggedInUser);
  };

  const handleGoDeveloperDetail = () => {
    router.push(`/themes/${theme.id}/developers/${developer.id}/detail`);
  };

  // 開発者自身でなければいいねできる
  const canLike = developer.userId !== session?.user.id;

  return (
    <Card
      key={developer.userId}
      sx={(theme) => ({
        position: "static",
        cursor: "pointer",
        transition: "all 150ms",
        "&:not(:has(*[data-user-icon]:hover)):hover": {
          boxShadow: `${theme.shadows.lg}, 0 0 0 2px ${theme.colors.red[7]}`,
        },
      })}
      onClick={handleGoDeveloperDetail}
    >
      <Flex justify="space-between">
        <Flex gap={10}>
          <UserIconLink iconSrc={developer.image} userId={developer.userId} />
          <TextLink
            href={`/themes/${theme.id}/developers/${developer.id}/detail`}
          >
            <Text fw="bold" size="lg">
              {developer.name}
            </Text>
          </TextLink>
        </Flex>
        <Flex onClick={stopPropagation}>
          <Tooltip
            label="コードを見に行く"
            position="top"
            withArrow
            transition="pop"
          >
            <ActionIcon
              size={30}
              component={Link}
              // githubのURLをgithub1sに変換
              href={developer.githubUrl.replace(
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
              <BsGithub size="80%" fill={mantineTheme.colors.gray[7]} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex align="center" justify="space-between" mt={10}>
        <Text size="sm" color="gray.5">
          開発開始日: {formatDate(new Date(developer.createdAt))}
        </Text>
        <Box>
          <DeveloperLikeButton
            likes={developer.likes}
            likedByLoggedInUser={developer.likedByLoggedInUser}
            onClick={handleLikeDeveloper}
            disabled={!canLike}
          />
        </Box>
      </Flex>
    </Card>
  );
};
