import { Box, Card, Flex, Stack, Text } from "@mantine/core";
import { User } from "@prisma/client";

import React from "react";
import { useFavoriteListQuery } from "../../hooks/useFavoriteListQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { AppPagination } from "../AppPagination";
import { UserCard, userCardMinWidthPx } from "../UserCard";

type Props = { user: User };

export const FavoriteListPage: React.FC<Props> = ({ user }) => {
  const [favoPage, setFavoPage] = usePaginationState({});
  const { favoriteList } = useFavoriteListQuery(user.id, favoPage);

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
        <Text align="center" size="xl" fw={700}>
          {user.name}
        </Text>
        <hr />
        <Text align="center" size={"sm"}>
          お気に入り一覧
        </Text>
      </Card>

      <Stack mt="md" w="100%">
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

        <AppPagination
          page={Number(favoPage)}
          onChange={setFavoPage}
          total={favoriteList?.allPages ?? 0}
        />
      </Stack>
    </Flex>
  );
};
