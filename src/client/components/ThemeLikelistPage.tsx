import { Avatar, Card, Flex, Pagination, Stack, Text, Title } from "@mantine/core";
import { Theme } from "../../server/models/theme";
import { usePaginationState } from "../hooks/usePaginationState";
import { useThemeLikesQuery } from "../hooks/useUsersLikedThemeQuery";
import ThemeLikelistCard from "./ThemeLikelistCard";

type Props = { theme: Theme };
export const ThemeLikelistPage: React.FC<Props> = ({ theme }) => {
  const [page, setPage] = usePaginationState({});
  const { data } = useThemeLikesQuery(theme.id, page);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex mt={30} gap={15} wrap="wrap">
      <Card h={150} w={560} mt="xl">
          <Title order={3} color="red.7">{theme?.title}</Title>
          <Flex mt="md" gap={10}>
            <Avatar
              src={theme?.user.image}
              size="md"
              radius={100}
              sx={(theme) => ({
                borderWidth: "2px",
                borderColor: theme.colors.gray[2],
                borderStyle: "solid",
                borderRadius: "100%",
              })}
            />
            <Text>{theme?.user.name}</Text>
          </Flex>
        </Card>
      </Flex>
      <Stack mt={10}>
        <Title mt={20} order={4} align="left">
          いいねした人
        </Title>
        {data?.users.map((users) => {
          return (
            <ThemeLikelistCard
              key={users.id}
              userImage={users.image}
              userName={users.name}
            />
          );
        })}
        <Pagination
          page={page}
          onChange={setPage}
          total={data?.allPages ?? 0}
        />
      </Stack>
    </Flex>
  );
};
