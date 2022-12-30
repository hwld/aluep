import { Card, Flex, Stack, Text, Title } from "@mantine/core";
import { Theme } from "../../server/models/theme";
import { usePaginationState } from "../hooks/usePaginationState";
import { useThemeLikingUsersQuery } from "../hooks/useThemeLikingUsersQuery";
import { AppPagination } from "./AppPagination";
import { NothingThemeLikingUsers } from "./NothingThemeLikingUsers";
import { ThemeLikingUserCard } from "./ThemeLikingUserCard";
import { UserIconLink } from "./UserIconLink";

type Props = { theme: Theme };
export const ThemeLikingUsersPage: React.FC<Props> = ({ theme }) => {
  const [page, setPage] = usePaginationState({});
  const { data } = useThemeLikingUsersQuery(theme.id, page);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex mt={10} gap={15} wrap="wrap">
        <Card h={150} w={560} mt="xl">
          <Title order={3} color="red.7">
            {theme.title}
          </Title>
          <Flex mt="md" gap={10}>
            <UserIconLink userId={theme.user.id} imageSrc={theme.user.image} />
            <Text>{theme.user.name}</Text>
          </Flex>
        </Card>
      </Flex>
      <Stack mt={10}>
        {theme.likes === 0 ? (
          <NothingThemeLikingUsers />
        ) : (
          <Title mt={10} order={4} align="left">
            いいねした人
          </Title>
        )}
        {data?.users.map((users) => {
          return (
            <ThemeLikingUserCard
              key={users.id}
              userId={users.id}
              userImage={users.image}
              userName={users.name}
            />
          );
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
