import { Card, Flex, Text } from "@mantine/core";
import { AppThemeLike } from "@prisma/client";
import { useRouter } from "next/router";
import { User } from "../../../server/models/user";
import { Routes } from "../../../share/routes";
import { formatDate } from "../../lib/utils";
import { TextLink } from "../../ui/TextLink";
import { UserIcon } from "./UserIcon";

export const likingUserCardMinWidthPx = 350;

type Props = {
  user: User;
  appTheme: AppThemeLike;
};
export const LikingUserCard: React.FC<Props> = ({ user, appTheme }) => {
  const router = useRouter();

  const handleGoUserDetail = () => {
    router.push(Routes.user(user.id));
  };

  //お題をいいねしたユーザーのカード
  return (
    <Card
      miw={likingUserCardMinWidthPx}
      w="100%"
      sx={(theme) => ({
        gap: theme.spacing.sm,
        maxHeight: "100px",
        cursor: "pointer",
        position: "static",
        transition: "all 150ms",
        "&:hover": {
          boxShadow: `${theme.shadows.lg}, 0 0 0 2px ${theme.colors.red[7]}`,
        },
      })}
      onClick={handleGoUserDetail}
    >
      <Flex justify="space-between">
        <Flex gap={10}>
          {/* アイコン　*/}
          <UserIcon iconSrc={user.image} />
          {/* 名前 */}
          <TextLink href={Routes.user(user.id)}>
            <Text
              sx={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              fw="bold"
              size="lg"
            >
              {user.name}
            </Text>
          </TextLink>
        </Flex>
      </Flex>
      {/* いいねをした日付 */}
      <Flex align="center" justify="flex-start" mt={10}>
        <Text size="sm" color="gray.5">
          いいねした日: {formatDate(new Date(appTheme.createdAt))}
        </Text>
      </Flex>
    </Card>
  );
};
