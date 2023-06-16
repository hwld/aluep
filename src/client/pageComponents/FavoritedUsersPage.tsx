import { Box, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import { BiBookmarkHeart } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { TbHeart } from "react-icons/tb";
import { User } from "../../server/models/user";
import { paginatedPageSchema } from "../../share/schema";
import { UserCard, userCardMinWidthPx } from "../features/user/UserCard";
import { UserSummaryCard } from "../features/user/UserSummaryCard";
import { useFavoritedUsersPerPage } from "../features/user/useFavoritedUsersPerPage";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";
import { PageHeader } from "../ui/PageHeader";

type Props = { user: User };

export const FavoritedUsersPage: React.FC<Props> = ({ user }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { favoritedUsersPerPage } = useFavoritedUsersPerPage(user.id, page);
  const { colors } = useMantineTheme();

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <PageHeader icon={BiBookmarkHeart} pageName="お気に入りユーザー" />
      <Stack maw={800} m="auto" spacing="lg">
        <Stack spacing="sm">
          <Text c="gray.5">ユーザー</Text>
          <UserSummaryCard user={user} />
        </Stack>
        {favoritedUsersPerPage?.list.length === 0 ? (
          <Flex direction="column" align="center" gap={50}>
            <Flex align="flex-end" justify="center">
              <BsFillPeopleFill size={70} color={colors.red[7]} />
              <TbHeart size={70} color={colors.red[3]} fill={colors.red[3]} />
              <TbHeart size={100} color={colors.red[4]} fill={colors.red[4]} />
              <TbHeart size={130} color={colors.red[5]} fill={colors.red[5]} />
              <TbHeart size={160} color={colors.red[6]} fill={colors.red[6]} />
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
              {favoritedUsersPerPage?.list.map((user) => {
                return <UserCard key={user.id} user={user} />;
              })}
            </Box>
          </Stack>
        )}
        <AppPagination
          page={page}
          onChange={handleChangePage}
          total={favoritedUsersPerPage?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};
