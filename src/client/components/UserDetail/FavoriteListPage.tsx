import {
  Box,
  Card,
  Flex,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
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
      w="100%"
      maw={600}
      miw={600}
      gap={20}
      sx={() => ({
        marginLeft: "auto",
        marginRight: "auto",
      })}
    >
      <Card>
        <Text
          align="center"
          sx={() => {
            return {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            };
          }}
        >
          {user.name}
        </Text>
      </Card>

      <Title order={4}>お気に入り一覧</Title>

      <Stack mt="md" w="100%">
        {favoriteList?.pagefavo.length === 0 ? (
          <Flex direction="column" align="center" gap={50}>
            <Flex align="flex-end" justify="center">
              <BsFillPeopleFill size={70} color={mantineTheme.colors.red[7]} />
              <MdFavorite size={70} color={mantineTheme.colors.red[3]} />
              <MdFavorite size={100} color={mantineTheme.colors.red[4]} />
              <MdFavorite size={130} color={mantineTheme.colors.red[5]} />
              <MdFavorite size={160} color={mantineTheme.colors.red[6]} />
            </Flex>

            <Text size={30}>ユーザのお気に入りをまだしていません</Text>

            <Text c="gray.5">
              他のユーザをお気に入りすると、ここに表示されます。
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
