import { Box, Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { User } from "@prisma/client";

import React from "react";
import { BiBookmarkHeart } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { TbHeart } from "react-icons/tb";
import { useFavoriteListQuery } from "../../hooks/useFavoriteListQuery";
import { usePaginationState } from "../../hooks/usePaginationState";
import { AppPagination } from "../AppPagination";
import { UserCard, userCardMinWidthPx } from "../UserCard";
import { UserSummaryCard } from "../UserSummaryCard";

type Props = { user: User };

export const FavoriteListPage: React.FC<Props> = ({ user }) => {
  const [favoPage, setFavoPage] = usePaginationState({});
  const { favoriteList } = useFavoriteListQuery(user.id, favoPage);
  const mantineTheme = useMantineTheme();

  return (
    <Stack maw={800} m="auto" spacing="lg">
      <Flex align="center" gap="sm">
        <BiBookmarkHeart
          size="30px"
          color={mantineTheme.colors.red[7]}
          style={{ marginTop: "3px" }}
        />
        <Title order={3}>お気に入り</Title>
      </Flex>
      <Stack spacing="sm">
        <Text c="gray.5">ユーザー</Text>
        <UserSummaryCard user={user} />
      </Stack>
      {favoriteList?.pagefavo.length === 0 ? (
        <Flex direction="column" align="center" gap={50}>
          <Flex align="flex-end" justify="center">
            <BsFillPeopleFill size={70} color={mantineTheme.colors.red[7]} />
            <TbHeart
              size={70}
              color={mantineTheme.colors.red[3]}
              fill={mantineTheme.colors.red[3]}
            />
            <TbHeart
              size={100}
              color={mantineTheme.colors.red[4]}
              fill={mantineTheme.colors.red[4]}
            />
            <TbHeart
              size={130}
              color={mantineTheme.colors.red[5]}
              fill={mantineTheme.colors.red[5]}
            />
            <TbHeart
              size={160}
              color={mantineTheme.colors.red[6]}
              fill={mantineTheme.colors.red[6]}
            />
          </Flex>

          <Text size={30}>ユーザのお気に入りをまだしていません</Text>

          <Text c="gray.5">
            他のユーザをお気に入りすると、ここに表示されます。
          </Text>
        </Flex>
      ) : (
        <Stack spacing="sm">
          <Text c="gray.5">お気に入りユーザー</Text>
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
              gap: theme.spacing.xs,
            })}
          >
            {favoriteList?.pagefavo.map((user) => {
              return <UserCard key={user.id} user={user} />;
            })}
          </Box>
        </Stack>
      )}
      <AppPagination
        page={Number(favoPage)}
        onChange={setFavoPage}
        total={favoriteList?.allPages ?? 0}
      />
    </Stack>
  );
};
