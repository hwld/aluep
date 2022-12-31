import { Card, Flex, Stack, Text, Title } from "@mantine/core";
import { Theme } from "../../server/models/theme";
import { usePaginationState } from "../hooks/usePaginationState";
import { useThemeLikingUsersQuery } from "../hooks/useThemeLikingUsersQuery";
import { AppPagination } from "./AppPagination";
import { NothingThemeLikingUsers } from "./NothingThemeLikingUsers";
import { UserCard } from "./UserCard";
import { UserIconLink } from "./UserIconLink";

type Props = { theme: Theme };
export const ThemeLikingUsersPage: React.FC<Props> = ({ theme }) => {
  const [page, setPage] = usePaginationState({});
  const { data } = useThemeLikingUsersQuery(theme.id, page);

  return (
    <Flex maw={800} direction="column" align="center" m="auto">
      <Card h={150} w="100%" mt="xl">
        <Title order={3} color="red.7">
          {theme.title}
        </Title>
        <Flex mt="md" gap={10}>
          <UserIconLink userId={theme.user.id} iconSrc={theme.user.image} />
          <Text>{theme.user.name}</Text>
        </Flex>
      </Card>
      <Stack mt="xl" w="100%" spacing="xs">
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
