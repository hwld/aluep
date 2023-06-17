import { Flex, Text, useMantineTheme } from "@mantine/core";
import { useMemo } from "react";
import { BiMedal } from "react-icons/bi";
import { TbHeart } from "react-icons/tb";
import { User } from "../../../server/models/user";
import { Routes } from "../../../share/routes";
import { TextLink } from "../../ui/TextLink";
import { UserIconLink } from "./UserIconLink";

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
      <Flex align="center" miw={0}>
        <Flex
          w="30px"
          miw="30px"
          justify="center"
          sx={{ alignSelf: ranking <= 3 ? "flex-start" : "auto" }}
        >
          {rank}
        </Flex>
        <Flex align="center" gap="xs" miw={0}>
          <UserIconLink userId={user.id} iconSrc={user.image} />
          <Flex miw={0} direction="column">
            <TextLink href={Routes.user(user.id)}>
              <Text size="xs" truncate>
                {user.name}
              </Text>
            </TextLink>
            <Flex align="center" gap={5}>
              <TbHeart
                size="20px"
                color="transparent"
                fill={mantineTheme.colors.red[7]}
              />
              <Text size="xs" c="red.7">
                {likeCount}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
