import {
  Flex, Stack, Title
} from "@mantine/core";
import { useRouter } from "next/router";
import { useThemeLikesQuery } from "../hooks/useThemeLikesQuery";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { useThemesQuery } from "../hooks/useThemesQuery";
import { ThemeCard } from "./ThemeCard/ThemeCard";
import ThemeLikelistCard from "./ThemeLikelistCard";

export const ThemeLikelistPage: React.FC = () => {
  const router = useRouter();
  // TODO
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  const { themes } = useThemesQuery();
  const { users } = useThemeLikesQuery(themeId);

  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Flex mt={30} gap={15} wrap="wrap">
          {themes.map((theme) => {
            if (themeId === theme.id){
              return ( 
                <ThemeCard key={theme.id} theme={theme} />
              );
            }
          })}
      </Flex>
      <Title mt={30} order={3}>いいねした人</Title>
      <Stack mt={30} >
          {users?.map((user) => {
              return ( 
                <ThemeLikelistCard
                  userImage={user.image}
                  userName={user.name}
                />
              );
          })}
      </Stack>
    </Flex>
  );
};