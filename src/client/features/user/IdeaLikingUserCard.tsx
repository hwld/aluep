import { Card, Flex, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { IdeaLikingUser } from "../../../server/models/ideaLike";
import { Routes } from "../../../share/routes";
import { formatDate } from "../../lib/utils";
import { TextLink } from "../../ui/TextLink";
import { UserIcon } from "./UserIcon";

export const ideaLikingUserCardMinWidthPx = 350;

type Props = {
  likingUser: IdeaLikingUser;
};
export const IdeaLikingUserCard: React.FC<Props> = ({ likingUser }) => {
  const router = useRouter();

  const handleGoUserDetail = () => {
    router.push(Routes.user(likingUser.id));
  };

  //お題をいいねしたユーザーのカード
  return (
    <Card
      miw={ideaLikingUserCardMinWidthPx}
      w="100%"
      sx={(theme) => ({
        gap: theme.spacing.sm,
        maxHeight: "100px",
        cursor: "pointer",
        position: "static",
        transition: "all 100ms",
        outline: "transparent solid 0px",
        "&:hover": {
          outline: `${theme.colors.red[6]} solid 2px`,
          outlineOffset: "2px",
        },
      })}
      onClick={handleGoUserDetail}
    >
      <Flex justify="space-between">
        <Flex gap={10} miw={0}>
          {/* アイコン　*/}
          <UserIcon iconSrc={likingUser.image} />
          {/* 名前 */}
          <TextLink href={Routes.user(likingUser.id)}>
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
              {likingUser.name}
            </Text>
          </TextLink>
        </Flex>
      </Flex>
      {/* いいねをした日付 */}
      <Flex align="center" justify="flex-start" mt={10}>
        <Text size="sm" color="gray.5">
          いいねした日: {formatDate(likingUser.likedDate)}
        </Text>
      </Flex>
    </Card>
  );
};
