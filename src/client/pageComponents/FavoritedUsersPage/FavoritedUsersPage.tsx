import {
  UserCard,
  userCardMinWidthPx,
} from "@/client/features/user/UserCard/UserCard";
import { UserSummaryCard } from "@/client/features/user/UserSummaryCard/UserSummaryCard";
import { useFavoritedUsers } from "@/client/features/user/useFavoritedUsers";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { User } from "@/models/user";
import { paginatedPageSchema } from "@/share/paging";
import { Box, Flex, Stack, Text, useMantineTheme } from "@mantine/core";
import React from "react";
import { BiBookmarkHeart } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { TbHeart } from "react-icons/tb";

type Props = { user: User };

export const FavoritedUsersPage: React.FC<Props> = ({ user }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { favoritedUsers } = useFavoritedUsers({ userId: user.id, page });
  const { colors } = useMantineTheme();

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  // TODO:
  return (
    <>
      <PageHeader icon={BiBookmarkHeart} pageName="お気に入りユーザー" />
      <Stack maw={800} m="auto" gap="lg">
        <Stack gap="sm">
          <Text c="gray.5">ユーザー</Text>
          <UserSummaryCard user={user} />
        </Stack>
        {favoritedUsers?.list.length === 0 ? (
          <Flex direction="column" align="center" gap={50}>
            <Flex align="flex-end" justify="center">
              <BsFillPeopleFill size={70} color={colors.red[7]} />
              <TbHeart size={70} color={colors.red[3]} fill={colors.red[3]} />
              <TbHeart size={100} color={colors.red[4]} fill={colors.red[4]} />
              <TbHeart size={130} color={colors.red[5]} fill={colors.red[5]} />
              <TbHeart size={160} color={colors.red[6]} fill={colors.red[6]} />
            </Flex>

            <Text size="xl">ユーザのお気に入りをまだしていません</Text>

            <Text c="gray.5">
              他のユーザをお気に入りすると、ここに表示されます。
            </Text>
          </Flex>
        ) : (
          <Stack gap="sm">
            <Text c="gray.5">お気に入りユーザー</Text>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
                gap: "var(--mantine-spacing-xs)",
              }}
            >
              {favoritedUsers?.list.map((user) => {
                return <UserCard key={user.id} user={user} />;
              })}
            </Box>
          </Stack>
        )}
        <AppPagination
          value={page}
          onChange={handleChangePage}
          total={favoritedUsers?.allPages ?? 0}
        />
      </Stack>
    </>
  );
};