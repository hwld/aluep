import { Flex, MediaQuery, Stack, Title, useMantineTheme } from "@mantine/core";

import {
  useTop10LikesDeveloperInThisMonth,
  useTop10LikesPostersInThisMonth,
  useTop10LikesThemesInThisMonth,
} from "../hooks/useRankingQuery";
import { NothingLike } from "./NothingLike";

import { RankingCard } from "./RankingCard";

import { PickedUpThemes } from "./PickedUpThemes";
import { UserLikeRankingItem } from "./UserLikeRankingItem";

import { IoSparkles } from "react-icons/io5";
import { MdComputer, MdOutlineFavorite } from "react-icons/md";
import { usePickedUpThemesQuery } from "../hooks/usePickedUpThemesQuery";
import { NothingPopularThemes } from "./NothingPopularThemes";
import { PopularThemeCarousel } from "./PopularThemeCarousel/PopularThemeCarousel";
import { themeCardMinWidthPx } from "./ThemeCard/ThemeCard";

export const HomePage: React.FC = () => {
  const mantineTheme = useMantineTheme();

  // ランキング
  const { top10LikesThemesInThisMonth } = useTop10LikesThemesInThisMonth();
  const { top10LikesDevelopersInThisMonth } =
    useTop10LikesDeveloperInThisMonth();
  const { top10LikesPostersInThisMonth } = useTop10LikesPostersInThisMonth();

  // ピックアップされたお題
  const { pickedUpThemes: latestThemes } =
    usePickedUpThemesQuery("createdDesc");
  const { pickedUpThemes: manyLikesThemes } =
    usePickedUpThemesQuery("likeDesc");
  const { pickedUpThemes: manyDevelopersThemes } =
    usePickedUpThemesQuery("developerDesc");

  return (
    <Flex w="100%" gap="xl">
      <Stack miw={0} sx={{ flexGrow: 1, flexShrink: 1 }} spacing={35}>
        <Stack spacing="sm">
          <Title order={4}>人気のお題</Title>
          {top10LikesThemesInThisMonth?.length === 0 ? (
            <NothingPopularThemes />
          ) : (
            <PopularThemeCarousel
              themes={top10LikesThemesInThisMonth}
              miw={`${themeCardMinWidthPx}px`}
            />
          )}
        </Stack>

        <PickedUpThemes
          icon={
            <IoSparkles size="25px" color={mantineTheme.colors.yellow[7]} />
          }
          title="最新のお題"
          readMoreHref="/themes/search?order=createdDesc"
          themes={latestThemes}
        />
        <PickedUpThemes
          icon={
            <MdOutlineFavorite
              size="25px"
              color={mantineTheme.colors.pink[7]}
            />
          }
          title="いいねが多かったお題"
          readMoreHref="/themes/search?order=likeDesc"
          themes={manyLikesThemes}
        />
        <PickedUpThemes
          icon={<MdComputer size="30px" color={mantineTheme.colors.blue[7]} />}
          title="開発者が多かったお題"
          readMoreHref="/themes/search?order=developerDesc"
          themes={manyDevelopersThemes}
        />
      </Stack>
      <MediaQuery smallerThan={"lg"} styles={{ display: "none" }}>
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
