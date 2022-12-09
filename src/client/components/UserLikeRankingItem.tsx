import { Avatar, Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import { useMemo } from "react";
import { BiMedal } from "react-icons/bi";
import { MdOutlineFavorite } from "react-icons/md";

// TODO: prismaのUserを直接使っているため、Date型が含まれるのだが、
//       trpcではシリアライズされてStringになっているのでエラーが出る
//       models/uesrを作って、そこで変換できるようにしたい
type Props = { ranking: number; user: User; likeCount: number };
export const UserLikeRankingItem: React.FC<Props> = ({
  ranking,
  user,
  likeCount,
}) => {
  const mantineTheme = useMantineTheme();

  const rank = useMemo(() => {
    switch (ranking) {
      case 1:
        return <BiMedal size="30px" color="rgb(255, 196, 0)" />;
      case 2:
        return <BiMedal size="30px" color="rgb(201, 201, 201)" />;
      case 3:
        return <BiMedal size="30px" color="rgb(172, 109, 77)" />;
      default:
        return <Text color="gray.5">{ranking}</Text>;
    }
  }, [ranking]);

  return (
    <Flex align="center" justify="space-between">
      <Flex align="center">
        <Flex w="30px" justify="center">
          {rank}
        </Flex>
        <Flex align="center" gap="sm">
          <Avatar src={user.image} radius="xl" />
          <Text size="sm">{user.name}</Text>
        </Flex>
      </Flex>
      <Flex align="center" gap={5}>
        <MdOutlineFavorite size="20px" color={mantineTheme.colors.red[7]} />
        <Text color="gray.5">{likeCount}</Text>
      </Flex>
    </Flex>
  );
};
