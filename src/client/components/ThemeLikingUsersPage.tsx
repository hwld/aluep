import { Flex, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { MdOutlineFavorite } from "react-icons/md";
import { Theme } from "../../server/models/theme";
import { usePaginationState } from "../hooks/usePaginationState";
import { useThemeLikingUsersQuery } from "../hooks/useThemeLikingUsersQuery";
import { AppPagination } from "./AppPagination";
import { NothingThemeLikingUsers } from "./NothingThemeLikingUsers";
import { ThemeSummaryCard } from "./ThemeSummaryCard";
import { UserCard } from "./UserCard";

type Props = { theme: Theme };
export const ThemeLikingUsersPage: React.FC<Props> = ({ theme }) => {
  const [page, setPage] = usePaginationState({});
  const { data } = useThemeLikingUsersQuery(theme.id, page);
  const mantineTheme = useMantineTheme();

  return (
    <Stack maw={800} m="auto" spacing="lg">
      <Flex align="center" gap="xs">
        <MdOutlineFavorite
          size="30px"
          color={mantineTheme.colors.red[7]}
          style={{ marginTop: "2px" }}
        />
        <Title order={3}>お題いいね一覧</Title>
      </Flex>
      <Stack spacing="xs">
        <Text c="gray.5">いいねされたお題</Text>
        <ThemeSummaryCard theme={theme} />
      </Stack>
      {theme.likes === 0 ? (
        <NothingThemeLikingUsers />
      ) : (
        <Stack spacing="xs">
          <Text c="gray.5" align="left">
            いいねしたユーザー
          </Text>
          <Stack spacing="xs">
            {data?.users.map((user) => {
              return <UserCard user={user} key={user.id} />;
            })}
          </Stack>
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
