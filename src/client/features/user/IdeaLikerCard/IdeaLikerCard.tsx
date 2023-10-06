import { UserIcon } from "@/client/features/user/UserIcon/UserIcon";
import { formatDate } from "@/client/lib/utils";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { IdeaLiker } from "@/models/ideaLike";
import { Routes } from "@/share/routes";
import { Card, Flex, Text } from "@mantine/core";
import { useRouter } from "next/router";
import classes from "./IdeaLikerCard.module.css";

export const ideaLikerCardMinWidthPx = 350;

type Props = {
  liker: IdeaLiker;
};
export const IdeaLikerCard: React.FC<Props> = ({ liker }) => {
  const router = useRouter();

  const handleGoUserDetail = () => {
    router.push(Routes.user(liker.id));
  };

  //お題をいいねしたユーザーのカード
  return (
    <Card
      miw={ideaLikerCardMinWidthPx}
      w="100%"
      className={classes.root}
      onClick={handleGoUserDetail}
    >
      <Flex justify="space-between">
        <Flex gap={10} miw={0}>
          {/* アイコン　*/}
          <UserIcon iconSrc={liker.image} />
          {/* 名前 */}
          <TextLink href={Routes.user(liker.id)}>
            <Text truncate style={{ flexShrink: 0 }} fw="bold" size="lg">
              {liker.name}
            </Text>
          </TextLink>
        </Flex>
      </Flex>
      {/* いいねをした日付 */}
      <Flex align="center" justify="flex-start" mt={10}>
        <Text size="sm" c="gray.5">
          いいねした日: {formatDate(liker.likedDate)}
        </Text>
      </Flex>
    </Card>
  );
};
