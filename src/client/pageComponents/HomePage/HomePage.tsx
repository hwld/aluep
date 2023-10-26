import { EmptyHomeIdeas } from "@/client/features/idea/EmptyHomeIdeas/EmptyHomeIdeas";
import { ideaCardMinWidthPx } from "@/client/features/idea/IdeaCard/IdeaCard";
import { IdeaSearchByTagCard } from "@/client/features/idea/IdeaSearchByTagCard/IdeaSearchByTagCard";
import { PickedUpIdeas } from "@/client/features/idea/PickedUpIdeas/PickedUpIdeas";
import { PopularIdeaCarousel } from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCarousel";
import { usePickedUpIdeasQuery } from "@/client/features/idea/usePickedUpIdeasQuery";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import {
  useTop10LikesDevsInThisMonth,
  useTop10LikesIdeasInThisMonth,
  useTop10LikesPostersInThisMonth,
} from "@/client/features/user/useRankingQuery";
import { UserLikeRankingItem } from "@/client/features/user/UserLikeRankingItem/UserLikeRankingItem";
import { trpc } from "@/client/lib/trpc";
import { EmptyRankingContent } from "@/client/ui/EmptyRankingContent/EmptyRankingContent";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { RankingCard } from "@/client/ui/RankingCard/RankingCard";
import { Routes } from "@/share/routes";
import { Center, Flex, Stack, Title } from "@mantine/core";
import {
  TbBulb,
  TbCode,
  TbFlame,
  TbHeart,
  TbHome,
  TbThumbUp,
} from "react-icons/tb";

export const HomePage: React.FC = () => {
  const { session } = useSessionQuery();
  // おすすめのお題
  const { data: recommendedIdeas } = trpc.idea.getRecommendedIdeas.useQuery(
    undefined,
    { initialData: [] }
  );

  // ランキング
  const { top10LikesIdeasInThisMonth } = useTop10LikesIdeasInThisMonth();
  const { top10LikesDevsInThisMonth } = useTop10LikesDevsInThisMonth();
  const { top10LikesPostersInThisMonth } = useTop10LikesPostersInThisMonth();

  // ピックアップされたお題
  const { pickedUpIdeas: latestIdeas } = usePickedUpIdeasQuery("createdDesc");
  const { pickedUpIdeas: manyLikesIdeas } = usePickedUpIdeasQuery("likeDesc");
  const { pickedUpIdeas: manyDevsIdeas } = usePickedUpIdeasQuery("devDesc");

  const isEmptyIdeas =
    [...latestIdeas, ...manyLikesIdeas, ...manyDevsIdeas].length < 1;

  return (
    <>
      <PageHeader icon={TbHome} pageName="ホーム" />
      <Flex w="100%" gap="xl">
        <Stack miw={0} style={{ flexGrow: 1, flexShrink: 1 }} gap={35}>
          {top10LikesIdeasInThisMonth.length > 0 && (
            <Stack gap="sm">
              <Flex gap={0} align="center">
                <TbFlame
                  size="35px"
                  color="var(--mantine-color-red-6)"
                  fill="var(--mantine-color-red-6)"
                />
                <Title order={4} size="h3" c="red.7">
                  人気のお題
                </Title>
              </Flex>
              <PopularIdeaCarousel
                ideas={top10LikesIdeasInThisMonth}
                miw={`${ideaCardMinWidthPx}px`}
              />
            </Stack>
          )}

          {isEmptyIdeas ? (
            <Center>
              <EmptyHomeIdeas isLoggedIn={session?.user !== undefined} />
            </Center>
          ) : (
            <>
              {recommendedIdeas.length > 0 && (
                <PickedUpIdeas
                  icon={
                    <TbThumbUp
                      size="30px"
                      color="var(--mantine-color-green-7)"
                    />
                  }
                  title="おすすめのお題"
                  ideas={recommendedIdeas}
                />
              )}

              <PickedUpIdeas
                icon={
                  <TbBulb size="30px" color="var(--mantine-color-yellow-7)" />
                }
                title="最新のお題"
                readMoreHref={Routes.ideaSearch({ order: "createdDesc" })}
                ideas={latestIdeas}
              />

              {manyLikesIdeas.length !== 0 && (
                <PickedUpIdeas
                  icon={
                    <TbHeart size="30px" color="var(--mantine-color-pink-7)" />
                  }
                  title="いいねが多かったお題"
                  readMoreHref={Routes.ideaSearch({ order: "likeDesc" })}
                  ideas={manyLikesIdeas}
                />
              )}

              {manyDevsIdeas.length !== 0 && (
                <PickedUpIdeas
                  icon={
                    <TbCode size="30px" color="var(--mantine-color-blue-7)" />
                  }
                  title="開発者が多かったお題"
                  readMoreHref={Routes.ideaSearch({ order: "devDesc" })}
                  ideas={manyDevsIdeas}
                />
              )}
            </>
          )}
        </Stack>

        <Flex direction="column" gap={30} mt={45} visibleFrom="lg">
          <IdeaSearchByTagCard />

          <RankingCard title="今月のいいねが多かった開発者">
            {top10LikesDevsInThisMonth?.length === 0 ? (
              <EmptyRankingContent page="devs" />
            ) : (
              top10LikesDevsInThisMonth?.map((dev, i) => (
                <UserLikeRankingItem
                  ranking={i + 1}
                  key={dev.id}
                  user={dev}
                  likeCount={dev.devLikes}
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
      </Flex>
    </>
  );
};
