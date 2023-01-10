import { Flex, Stack, Title } from "@mantine/core";
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

  return (
    <Flex maw={800} direction="column" align="center" m="auto">
      
      <Stack mt="xl" w="100%" spacing="xs">
        <ThemeSummaryCard theme={theme}/>
        {theme.likes === 0 ? (
          <NothingThemeLikingUsers />
        ) : (
          <Title order={4} align="left">
            いいねした人
          </Title>
        )}
        {data?.users.map((user) => {
          return <UserCard user={user} key={user.id} />;
        })}
        <AppPagination
          page={page}
          onChange={setPage}
          total={data?.allPages ?? 0}
        />
      </Stack>
    </Flex>
  );
};
