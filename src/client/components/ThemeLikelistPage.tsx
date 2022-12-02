import {
  Avatar,
  Box,
  Card,
  Flex,
  Text,
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
      <Card
          sx={{ flexShrink: 0, flexGrow: 0, height: "min-content" }}
          w={250}
        >
      <Flex gap={5} mt={5}>
            <Avatar
              src={theme?.user.image}
              size="md"
              sx={(theme) => ({
                borderWidth: "2px",
                borderColor: theme.colors.gray[2],
                borderStyle: "solid",
                borderRadius: "100%",
              })}
            />
            <Text size={13}>{theme?.user.name}</Text>
          </Flex>
      </Card>
    </Flex>
  );
};