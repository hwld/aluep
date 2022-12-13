import { Avatar, Flex, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";
import { useMemo } from "react";
import { BiMedal } from "react-icons/bi";
import { MdOutlineFavorite } from "react-icons/md";

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
        <Flex w="30px" justify="center" sx={{ alignSelf: "flex-start" }}>
          {rank}
        </Flex>
        <Flex align="center" gap="xs" miw={0}>
          <Avatar
            size="md"
            src={user.image}
            radius="xl"
            sx={(theme) => ({
              borderWidth: "2px",
              borderColor: theme.colors.gray[2],
              borderStyle: "solid",
              flexShrink: 0,
            })}
          />
          <Flex miw={0} direction="column">
            <Text
              size="xs"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name}
            </Text>
            <Flex align="center" gap={5}>
              <MdOutlineFavorite
                size="15px"
                color={mantineTheme.colors.red[7]}
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
