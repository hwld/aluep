import {
  Box,
  Flex,
  Title, useMantineTheme
} from "@mantine/core";
import { useRouter } from "next/router";
import { useThemeDevelopersQuery } from "../hooks/useThemeDevelopersQuery";
import { useThemeLike } from "../hooks/useThemeLike";
import { useThemeQuery } from "../hooks/useThemeQuery";
import { useThemesQuery } from "../hooks/useThemesQuery";
import { ThemeCard } from "./ThemeCard/ThemeCard";


export const ThemeLikelistPage: React.FC = () => {
  const router = useRouter();
  // TODO
  const themeId = router.query.id as string;
  const { theme } = useThemeQuery(themeId);

  const { likeThemeMutation, likedByLoggedInUser } = useThemeLike(themeId);

  const { developers, likeDeveloperMutation } =
    useThemeDevelopersQuery(themeId);

  const handleLikeTheme = () => {
    if (!theme) return;
    likeThemeMutation.mutate({
      themeId: theme?.id,
      like: !likedByLoggedInUser,
    });
  };

  const mantineTheme = useMantineTheme();
  const { themes } = useThemesQuery();


  return (
    <Flex maw={1200} direction="column" align="center" m="auto">
      <Box>
        <Flex mt={30} gap={15} wrap="wrap">
          {themes.map((theme) => {
            return <ThemeCard key={theme.id} theme={theme} />;
          })}
        </Flex>
        <Title mt={30} order={3}>いいねした人</Title>
      </Box>
    </Flex>
  );
};