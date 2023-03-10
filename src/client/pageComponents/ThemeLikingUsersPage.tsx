import { Box, Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { TbHeart } from "react-icons/tb";
import { Theme } from "../../server/models/theme";
import { paginatedPageSchema } from "../../share/schema";
import { ThemeSummaryCard } from "../features/theme/ThemeSummaryCard";
import {
  LikingUserCard,
  likingUserCardMinWidthPx,
} from "../features/user/LikingUserCard";
import { NothingThemeLikingUsers } from "../features/user/NothingThemeLikingUsers";
import { userCardMinWidthPx } from "../features/user/UserCard";
import { useThemeLikingUsersPerPage } from "../features/user/useThemeLikingUsersQuery";
import { useURLParams } from "../lib/useURLParams";
import { AppPagination } from "../ui/AppPagination";

type Props = { theme: Theme };
export const ThemeLikingUsersPage: React.FC<Props> = ({ theme }) => {
  const [{ page }, setURLParams] = useURLParams(paginatedPageSchema);
  const { themeLikingUsersPerPage } = useThemeLikingUsersPerPage(
    theme.id,
    page
  );
  const mantineTheme = useMantineTheme();

  const handleChangePage = (page: number) => {
    setURLParams({ page });
  };

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
              gridTemplateColumns: `repeat(auto-fit, minmax(${likingUserCardMinWidthPx}px, 1fr))`,
              gap: theme.spacing.xs,
            })}
          >
            {themeLikingUsersPerPage?.list.map((user) => {
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
        onChange={handleChangePage}
        total={themeLikingUsersPerPage?.allPages ?? 0}
      />
    </Stack>
  );
};
