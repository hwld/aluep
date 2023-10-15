import { UserIconLink } from "@/client/features/user/UserIconLink/UserIconLink";
import { IconCounter } from "@/client/ui/IconCounter/IconCounter";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Routes } from "@/share/routes";
import { Flex, Text } from "@mantine/core";
import { User } from "next-auth";
import { useMemo } from "react";
import { BiMedal } from "react-icons/bi";
import { TbHeart } from "react-icons/tb";

type Props = { ranking: number; user: User; likeCount: number };
export const UserLikeRankingItem: React.FC<Props> = ({
  ranking,
  user,
  likeCount,
}) => {
  const rank = useMemo(() => {
    switch (ranking) {
      case 1:
        return <BiMedal size="30px" color="rgb(255, 196, 0)" />;
      case 2:
        return <BiMedal size="30px" color="rgb(201, 201, 201)" />;
      case 3:
        return <BiMedal size="30px" color="rgb(172, 109, 77)" />;
      default:
        return <Text>{ranking}</Text>;
    }
  }, [ranking]);

  return (
    <Flex align="center" justify="space-between">
      <Flex align="center" miw={0}>
        <Flex
          w="30px"
          miw="30px"
          justify="center"
          style={{ alignSelf: ranking <= 3 ? "flex-start" : "auto" }}
        >
          {rank}
        </Flex>
        <Flex align="center" gap="xs" miw={0}>
          <UserIconLink userId={user.id} iconSrc={user.image} />
          <Flex miw={0} direction="column">
            <TextLink href={Routes.user(user.id)}>
              <Text size="xs" truncate mb="3px">
                {user.name}
              </Text>
            </TextLink>
            <Flex align="center" gap={5}>
              <IconCounter
                icon={
                  <TbHeart
                    style={{ width: "16px", height: "16px" }}
                    color="var(--mantine-color-red-7)"
                    fill="var(--mantine-color-red-7)"
                  />
                }
                counter={likeCount}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
