import {
  Box,
  Button,
  Card,
  Flex,
  Pagination,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { usePaginatedThemesQuery } from "../hooks/usePaginatedThemesQuery";
import { usePaginationState } from "../hooks/usePaginationState";
import {
  useTop10LikesDeveloperInThisMonth,
  useTop10LikesPostersInThisMonth,
  useTop10LikesThemesInThisMonth,
} from "../hooks/useRankingQuery";
import { PopularThemeCarousel } from "./PopularThemeCarousel/PopularThemeCarousel";

import { ThemeCard, themeCardMinWidthPx } from "./ThemeCard/ThemeCard";

export const HomePage: React.FC = () => {
  const [page, setPage] = usePaginationState();
  const { data } = usePaginatedThemesQuery(page);
  const { top10LikesThemesInThisMonth } = useTop10LikesThemesInThisMonth();
  const { top10LikesDevelopersInThisMonth } =
    useTop10LikesDeveloperInThisMonth();
  const { top10LikesPostersInThisMonth } = useTop10LikesPostersInThisMonth();

  return (
    <Flex gap={30} justify="space-between">
      <Flex direction="column" w="100%" gap="md">
        <Title order={3}>アプリ開発のお題</Title>
        <Button
          leftIcon={<FaSearch />}
          component={Link}
          href="/themes/search"
          w="min-content"
          mt={10}
          sx={(theme) => ({ boxShadow: theme.shadows.lg })}
        >
          お題を検索する
        </Button>

        {top10LikesThemesInThisMonth &&
          top10LikesThemesInThisMonth.length > 0 && (
            <Stack spacing="sm">
              <Title order={4}>人気のお題</Title>
              <PopularThemeCarousel themes={top10LikesThemesInThisMonth} />
            </Stack>
          )}

        <Stack>
          <Title order={4}>全てのお題</Title>
          <Box
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${themeCardMinWidthPx}px, 1fr))`,
              gap: theme.spacing.md,
            })}
          >
            {data?.themes.map((theme) => {
              return <ThemeCard key={theme.id} theme={theme} />;
            })}
          </Box>
          <Pagination
            page={page}
            onChange={setPage}
            total={data?.allPages ?? 0}
          />
        </Stack>
      </Flex>
      <Flex direction="column" gap={30}>
        <Box>
          <Text fw="bold">いいねが多かった開発者</Text>
          <Card mt={10} w={300} h={500} sx={{ flexShrink: 0 }}>
            {top10LikesDevelopersInThisMonth?.map((developer) => (
              <Text key={developer.id}>{developer.name}</Text>
            ))}
          </Card>
        </Box>
        <Box>
          <Text fw="bold">いいねが多かった投稿者</Text>
          <Card mt={10} w={300} h={500} sx={{ flexShrink: 0 }}>
            {top10LikesPostersInThisMonth?.map((poster) => (
              <Text key={poster.id}>{poster.name}</Text>
            ))}
          </Card>
        </Box>
      </Flex>
    </Flex>
  );
};
