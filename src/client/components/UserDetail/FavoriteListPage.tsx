import { Box, Card, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";

import React from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import { useFavoriteListQuery } from "../../hooks/useFavoriteListQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { AppPagination } from "../AppPagination";
import { UserCard, userCardMinWidthPx } from "../UserCard";

type Props = { user: User };

export const FavoriteListPage: React.FC<Props> = ({ user }) => {
  const [favoPage, setFavoPage] = usePaginationState({});
  const { favoriteList } = useFavoriteListQuery(user.id, favoPage);
  const mantineTheme = useMantineTheme();

  return (
    <Flex
      direction={"column"}
      w="50%"
      gap={10}
      sx={() => ({
        marginLeft: "auto",
        marginRight: "auto",
      })}
    >
      <Card>
        <Text align="center" size={40} fw={700}>
          {user.name}
        </Text>
        <hr />
        <Text align="center" size={"sm"}>
          お気に入り一覧
        </Text>
      </Card>

      <Stack mt="md" w="100%">
        {favoriteList?.pagefavo.length === 0 ? (
          <Flex direction={"column"} align={"center"} gap={10}>
            <Card bg={"red.1"}>
              <Flex align={"flex-end"}>
                <BsFillPeopleFill
                  size={100}
                  color={mantineTheme.colors.red[7]}
                />
                <MdFavorite size={100} color={mantineTheme.colors.red[3]} />
                <MdFavorite size={130} color={mantineTheme.colors.red[4]} />
                <MdFavorite size={160} color={mantineTheme.colors.red[5]} />
                <MdFavorite size={190} color={mantineTheme.colors.red[6]} />
              </Flex>
            </Card>
            <Text size={30}>開発者をお気に入りしてみよう！</Text>

            <Text c="gray.5">
              他の開発者をお気に入りすると、ここに表示されます。
            </Text>
          </Flex>
        ) : (
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
              gap: theme.spacing.md,
            })}
          >
            {favoriteList?.pagefavo.map((user) => {
              return <UserCard key={user.id} user={user} />;
            })}
          </Box>
        )}

        <AppPagination
          page={Number(favoPage)}
          onChange={setFavoPage}
          total={favoriteList?.allPages ?? 0}
        />
      </Stack>
    </Flex>
  );
};
