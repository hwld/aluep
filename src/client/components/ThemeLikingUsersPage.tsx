import { Box, Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { Theme } from "../../server/models/theme";
import { usePaginationState } from "../hooks/usePaginationState";
import { useThemeLikingUsersQuery } from "../hooks/useThemeLikingUsersQuery";
import { AppPagination } from "./AppPagination";
import { LikingUserCard } from "./LikingUserCard";
import { NothingThemeLikingUsers } from "./NothingThemeLikingUsers";
import { ThemeSummaryCard } from "./ThemeSummaryCard";
import { userCardMinWidthPx } from "./UserCard";

type Props = { theme: Theme };
export const ThemeLikingUsersPage: React.FC<Props> = ({ theme }) => {
  const [page, setPage] = usePaginationState({});
  const { data } = useThemeLikingUsersQuery(theme.id, page);
  const mantineTheme = useMantineTheme();

  return (
    <Stack w="100%" miw={userCardMinWidthPx} maw={800} m="auto" spacing="lg">
      <Flex align="center" gap="sm">
        <TbHeart
          size="35px"
          color="transparent"
          fill={mantineTheme.colors.red[7]}
        />
        <Title order={3}>お題のいいね</Title>
      </Flex>
      <Stack spacing="sm">
        <Text c="gray.5">いいねされたお題</Text>
        <ThemeSummaryCard theme={theme} />
      </Stack>
      {theme.likes === 0 ? (
        <NothingThemeLikingUsers />
      ) : (
        <Stack spacing="sm">
          <Text c="gray.5" align="left">
            いいねしたユーザー
          </Text>
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${userCardMinWidthPx}px, 1fr))`,
              gap: theme.spacing.xs,
            })}
          >
            {data?.users.map((user) => {
              return (
                <LikingUserCard
                  key={user.id}
                  user={user}
                  appTheme={{
                    id: "",
                    appThemeId: "",
                    userId: "",
                    createdAt: user.themeLikeCreated,
                  }}
                />
              );
            })}
          </Box>
        </Stack>
      )}
      <AppPagination
        page={page}
        onChange={setPage}
        total={data?.allPages ?? 0}
      />
    </Stack>
  );
};
