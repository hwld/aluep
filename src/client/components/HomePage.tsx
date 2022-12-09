import { Box, Button, Flex, Pagination, Stack, Title } from "@mantine/core";

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
import { RankingCard } from "./RankingCard";

import { ThemeCard, themeCardMinWidthPx } from "./ThemeCard/ThemeCard";
import { UserLikeRankingItem } from "./UserLikeRankingItem";

export const HomePage: React.FC = () => {
  const [page, setPage] = usePaginationState({});
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
        <Flex justify="space-between" gap="lg">
          <Stack>
            {top10LikesThemesInThisMonth &&
              top10LikesThemesInThisMonth.length > 0 && (
                <Stack spacing="sm" w="100%">
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
          </Stack>
          <Flex direction="column" gap={30}>
            <Box>
              <RankingCard title="今月のいいねが多かった開発者">
                {top10LikesDevelopersInThisMonth?.map((developer, i) => (
                  <UserLikeRankingItem
                    ranking={i + 1}
                    key={developer.id}
                    // TODO
                    user={{
                      ...developer,
                      createdAt: new Date(developer.createdAt),
                      updatedAt: new Date(developer.updatedAt),
                      emailVerified:
                        developer.emailVerified === null
                          ? null
                          : new Date(developer.emailVerified),
                    }}
                    likeCount={developer.developerLikes}
                  />
                ))}
              </RankingCard>
            </Box>
            <Box>
              <RankingCard title="今月のいいねが多かった投稿者">
                {top10LikesPostersInThisMonth?.map((poster, i) => (
                  <UserLikeRankingItem
                    ranking={i + 1}
                    key={poster.id}
                    // TODO
                    user={{
                      ...poster,
                      createdAt: new Date(poster.createdAt),
                      updatedAt: new Date(poster.updatedAt),
                      emailVerified:
                        poster.emailVerified === null
                          ? null
                          : new Date(poster.emailVerified),
                    }}
                    likeCount={poster.themeLikes}
                  />
                ))}
              </RankingCard>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
