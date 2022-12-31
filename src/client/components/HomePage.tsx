import { Flex, MediaQuery, Stack, Title } from "@mantine/core";

import { usePaginatedThemesQuery } from "../hooks/usePaginatedThemesQuery";
import { usePaginationState } from "../hooks/usePaginationState";
import {
  useTop10LikesDeveloperInThisMonth,
  useTop10LikesPostersInThisMonth,
  useTop10LikesThemesInThisMonth,
} from "../hooks/useRankingQuery";
import { useSessionQuery } from "../hooks/useSessionQuery";
import { AppPagination } from "./AppPagination";
import { NothingLike } from "./NothingLike";
import { NothingPopularThemes } from "./NothingPopularThemes";
import { NothingTheme } from "./NothingTheme";

import { PopularThemeCarousel } from "./PopularThemeCarousel/PopularThemeCarousel";
import { RankingCard } from "./RankingCard";

import { themeCardMinWidthPx } from "./ThemeCard/ThemeCard";
import { ThemeCardContainer } from "./ThemeCardContainer";
import { UserLikeRankingItem } from "./UserLikeRankingItem";

export const HomePage: React.FC = () => {
  const [page, setPage] = usePaginationState({});
  const { data } = usePaginatedThemesQuery(page);
  const { session } = useSessionQuery();

  const { top10LikesThemesInThisMonth } = useTop10LikesThemesInThisMonth();
  const { top10LikesDevelopersInThisMonth } =
    useTop10LikesDeveloperInThisMonth();
  const { top10LikesPostersInThisMonth } = useTop10LikesPostersInThisMonth();

  return (
    <Flex w="100%" gap="xl">
      <Stack miw={0} sx={{ flexGrow: 1, flexShrink: 1 }} spacing={50}>
        <Stack spacing="sm">
          <Title order={4}>人気のお題</Title>
          {top10LikesThemesInThisMonth?.length === 0 ? (
            <NothingPopularThemes />
          ) : (
            // TODO: Carouselが縮まない・・・
            <PopularThemeCarousel
              themes={top10LikesThemesInThisMonth}
              miw={`${themeCardMinWidthPx}px`}
            />
          )}
        </Stack>

        <Stack spacing="sm">
          <Title order={4}>全てのお題</Title>
          {data?.themes.length === 0 ? (
            <NothingTheme page="Home" user={session?.user} />
          ) : (
            <ThemeCardContainer themes={data?.themes ?? []} />
          )}
          <AppPagination
            page={page}
            onChange={setPage}
            total={data?.allPages ?? 0}
          />
        </Stack>
      </Stack>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Flex direction="column" gap={30}>
          <RankingCard title="今月のいいねが多かった開発者">
            {top10LikesDevelopersInThisMonth?.length === 0 ? (
              <NothingLike page="Developers" />
            ) : (
              top10LikesDevelopersInThisMonth?.map((developer, i) => (
                <UserLikeRankingItem
                  ranking={i + 1}
                  key={developer.id}
                  user={developer}
                  likeCount={developer.developerLikes}
                />
              ))
            )}
          </RankingCard>

          <RankingCard title="今月のいいねが多かった投稿者">
            {top10LikesPostersInThisMonth?.length === 0 ? (
              <NothingLike page="Posters" />
            ) : (
              top10LikesPostersInThisMonth?.map((poster, i) => (
                <UserLikeRankingItem
                  ranking={i + 1}
                  key={poster.id}
                  user={poster}
                  likeCount={poster.themeLikes}
                />
              ))
            )}
          </RankingCard>
        </Flex>
      </MediaQuery>
    </Flex>
  );
};
