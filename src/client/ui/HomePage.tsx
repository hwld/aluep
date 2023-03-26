import {
  Center,
  Flex,
  MediaQuery,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";

import {
  useTop10LikesDevelopmentInThisMonth,
  useTop10LikesIdeasInThisMonth,
  useTop10LikesPostersInThisMonth,
} from "../features/user/useRankingQuery";
import { EmptyRankingContent } from "./EmptyRankingContent";

import { RankingCard } from "./RankingCard";

import { PickedUpIdeas } from "../features/idea/PickedUpIdeas";
import { UserLikeRankingItem } from "../features/user/UserLikeRankingItem";

import { IoSparkles } from "react-icons/io5";
import { MdComputer } from "react-icons/md";
import { TbHeart } from "react-icons/tb";
import { Routes } from "../../share/routes";
import { EmptyHomeIdeas } from "../features/idea/EmptyHomeIdeas";
import { EmptyPopularIdeas } from "../features/idea/EmptyPopularIdeas";
import { ideaCardMinWidthPx } from "../features/idea/IdeaCard/IdeaCard";
import { PopularIdeaCarousel } from "../features/idea/PopularIdeaCarousel/PopularIdeaCarousel";
import { usePickedUpIdeasQuery } from "../features/idea/usePickedUpIdeasQuery";
import { useSessionQuery } from "../features/session/useSessionQuery";

export const HomePage: React.FC = () => {
  const { colors } = useMantineTheme();
  const { session } = useSessionQuery();

  // ランキング
  const { top10LikesIdeasInThisMonth } = useTop10LikesIdeasInThisMonth();
  const { top10LikesDevelopmentsInThisMonth } =
    useTop10LikesDevelopmentInThisMonth();
  const { top10LikesPostersInThisMonth } = useTop10LikesPostersInThisMonth();

  // ピックアップされたお題
  const { pickedUpIdeas: latestIdeas } = usePickedUpIdeasQuery("createdDesc");
  const { pickedUpIdeas: manyLikesIdeas } = usePickedUpIdeasQuery("likeDesc");
  const { pickedUpIdeas: manyDevelopmentsIdeas } =
    usePickedUpIdeasQuery("developmentDesc");

  const isEmptyIdeas =
    [...latestIdeas, ...manyLikesIdeas, ...manyDevelopmentsIdeas].length < 1;

  return (
    <Flex w="100%" gap="xl">
      <Stack miw={0} sx={{ flexGrow: 1, flexShrink: 1 }} spacing={35}>
        <Stack spacing="sm">
          <Title order={4}>人気のお題</Title>
          {top10LikesIdeasInThisMonth?.length === 0 ? (
            <EmptyPopularIdeas />
          ) : (
            <PopularIdeaCarousel
              ideas={top10LikesIdeasInThisMonth}
              miw={`${ideaCardMinWidthPx}px`}
            />
          )}
        </Stack>

        {isEmptyIdeas ? (
          <Center>
            <EmptyHomeIdeas isLoggedIn={session?.user !== undefined} />
          </Center>
        ) : (
          <>
            <PickedUpIdeas
              icon={<IoSparkles size="25px" color={colors.yellow[7]} />}
              title="最新のお題"
              readMoreHref={Routes.ideaSearch({ order: "createdDesc" })}
              ideas={latestIdeas}
            />
            <PickedUpIdeas
              icon={
                <TbHeart
                  size="30px"
                  color="transparent"
                  fill={colors.pink[7]}
                />
              }
              title="いいねが多かったお題"
              readMoreHref={Routes.ideaSearch({ order: "likeDesc" })}
              ideas={manyLikesIdeas}
            />
            <PickedUpIdeas
              icon={<MdComputer size="30px" color={colors.blue[7]} />}
              title="開発者が多かったお題"
              readMoreHref={Routes.ideaSearch({ order: "developmentDesc" })}
              ideas={manyDevelopmentsIdeas}
            />
          </>
        )}
      </Stack>
      <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
        <Flex direction="column" gap={30}>
          <RankingCard title="今月のいいねが多かった開発者">
            {top10LikesDevelopmentsInThisMonth?.length === 0 ? (
              <EmptyRankingContent page="developments" />
            ) : (
              top10LikesDevelopmentsInThisMonth?.map((development, i) => (
                <UserLikeRankingItem
                  ranking={i + 1}
                  key={development.id}
                  user={development}
                  likeCount={development.developmentLikes}
                />
              ))
            )}
          </RankingCard>

          <RankingCard title="今月のいいねが多かった投稿者">
            {top10LikesPostersInThisMonth?.length === 0 ? (
              <EmptyRankingContent page="posters" />
            ) : (
              top10LikesPostersInThisMonth?.map((poster, i) => (
                <UserLikeRankingItem
                  ranking={i + 1}
                  key={poster.id}
                  user={poster}
                  likeCount={poster.ideaLikes}
                />
              ))
            )}
          </RankingCard>
        </Flex>
      </MediaQuery>
    </Flex>
  );
};
