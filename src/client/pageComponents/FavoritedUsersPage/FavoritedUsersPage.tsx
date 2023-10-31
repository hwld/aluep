import { useFavoritedUsers } from "@/client/features/user/useFavoritedUsers";
import {
  UserCard,
  userCardMinWidthPx,
} from "@/client/features/user/UserCard/UserCard";
import { UserSummaryHeader } from "@/client/features/user/UserSummaryHeader/UserSummaryHeader";
import { useURLParams } from "@/client/lib/useURLParams";
import { AppPagination } from "@/client/ui/AppPagination/AppPagination";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { MutedText } from "@/client/ui/MutedText/MutedText";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { User } from "@/models/user";
import { paginatedPageSchema } from "@/share/paging";
import { Box, Card, Center, Stack, Text } from "@mantine/core";
import { IconHeartFilled, IconUserHeart } from "@tabler/icons-react";
import React from "react";

type Props = { user: User };

export const FavoritedUsersPage: React.FC<Props> = ({ user }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { favoritedUsers } = useFavoritedUsers({ userId: user.id, page });

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

  return (
    <>
      <PageHeader icon={IconUserHeart} pageName="お気に入りユーザー" />
      <Stack maw={800} m="auto" gap="lg">
        <Stack gap="sm">
          <MutedText>ユーザー</MutedText>
          <UserSummaryHeader user={user} />
        </Stack>
        {favoritedUsers?.list.length === 0 ? (
          <Center>
            <Card w="100%" style={{ alignItems: "center" }} py="xl">
              <EmptyContentItem
                icon={
                  <IconHeartFilled
                    width={100}
                    height={100}
                    style={{ color: "var(--mantine-color-red-6)" }}
                  />
                }
                text={"ユーザーをお気に入り登録していません"}
                description={
                  <>
                    ユーザーがお気に入り登録すると、<br></br>
                    ここに表示されます。
                  </>
                }
              />
            </Card>
          </Center>
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
