import { Flex, Stack, Title } from "@mantine/core";
import { Theme } from "../../server/models/theme";
import { useThemeLikesQuery } from "../hooks/useThemeLikesQuery";
import { ThemeCard } from "./ThemeCard/ThemeCard";
import ThemeLikelistCard from "./ThemeLikelistCard";

type Props = { theme: Theme };
export const ThemeLikelistPage: React.FC<Props> = ({ theme }) => {
  const { users } = useThemeLikesQuery(theme.id);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex mt={30} gap={15} wrap="wrap">
        <ThemeCard theme={theme} />
      </Flex>
      <Title mt={30} order={3}>
        いいねした人
      </Title>
      <Stack mt={30}>
        {users?.map((user) => {
          return (
            <ThemeLikelistCard
              key={user.id}
              userImage={user.image}
              userName={user.name}
            />
          );
        })}
      </Stack>
    </Flex>
  );
};
