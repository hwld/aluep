import { ideaCardMinWidthPx } from "@/client/features/idea/IdeaCard/IdeaCard";
import { IdeaSearchByTagCard } from "@/client/features/idea/IdeaSearchByTagCard/IdeaSearchByTagCard";
import { PickedUpIdeas } from "@/client/features/idea/PickedUpIdeas/PickedUpIdeas";
import { PopularIdeaCarousel } from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCarousel";
import { usePickedUpIdeasQuery } from "@/client/features/idea/usePickedUpIdeasQuery";
import {
  useTop10LikedDevelopers,
  useTop10LikedIdeaAuthors,
  useTop10LikedIdeas,
} from "@/client/features/user/useRankingQuery";
import { UserLikeRankingItem } from "@/client/features/user/UserLikeRankingItem/UserLikeRankingItem";
import { trpc } from "@/client/lib/trpc";
import { AppSkeleton } from "@/client/ui/AppSkeleton/AppSkeleton";
import { EmptyContentItem } from "@/client/ui/EmptyContentItem/EmptyContentItem";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { RankingCard } from "@/client/ui/RankingCard/RankingCard";
import { WelcomeMessageSection } from "@/client/ui/WelcomeMessageSection/WelcomeMessageSection";
import { Routes } from "@/share/routes";
import { Box, Flex, Stack, Title } from "@mantine/core";
import {
  IconBulb,
  IconCode,
  IconFlame,
  IconHeart,
  IconHome,
  IconThumbUp,
} from "@tabler/icons-react";
import classes from "./Home.module.css";
import { useEffect } from "react";

type Props = {
  welcomeMessageHidden?: boolean;
};

export const Home: React.FC<Props> = ({ welcomeMessageHidden }) => {
  // おすすめのお題
  const { data: recommendedIdeas, isInitialLoading: fetchingRecommended } =
    trpc.idea.getRecommendedIdeas.useQuery(undefined);

  // ランキング
  const { top10LikedIdeas, isInitialLoading: fetchingTop10LikedIdeas } =
    useTop10LikedIdeas();
  const {
    top10LikedDevelopers,
    isInitialLoading: fetchingTop10LikedDevelopers,
  } = useTop10LikedDevelopers();
  const {
    top10LikedIdeaAuthors,
    isInitialLoading: fetchingTop10LikedIdeaAuthors,
  } = useTop10LikedIdeaAuthors();

  // ピックアップされたお題
  const { pickedUpIdeas: latestIdeas, isInitialLoading: fetchingLatest } =
    usePickedUpIdeasQuery("createdDesc");
  const { pickedUpIdeas: manyLikesIdeas, isInitialLoading: fetchingLikes } =
    usePickedUpIdeasQuery("likeDesc");
  const { pickedUpIdeas: manyDevsIdeas, isInitialLoading: fetchingDevs } =
    usePickedUpIdeasQuery("devDesc");

  useEffect(() => {
    // 適当なページをprefetchして、バックエンド側でMantineのモジュール解決をキャッシュさせる
    fetch(`${process.env.NEXT_PUBLIC_URL}${Routes.about}`);
  }, []);

  return (
    <>
      <PageHeader icon={IconHome} pageName="ホーム" />
      <Flex w="100%" gap="xl">
        <Stack
          className={classes.content}
          miw={0}
          style={{ flexGrow: 1, flexShrink: 1 }}
          gap={35}
        >
          <WelcomeMessageSection
            defaultWelcomeMessageHidden={welcomeMessageHidden}
          />
          <Stack gap="sm">
            <Flex gap={0} align="center">
              <IconFlame
                width="35px"
                height="35px"
                color="var(--mantine-color-red-6)"
              />
              <Title order={4} size="h3" c="red.7">
                人気のお題
              </Title>
            </Flex>
            <PopularIdeaCarousel
              dummyProps={{ isDummy: fetchingTop10LikedIdeas }}
              ideas={top10LikedIdeas ?? []}
              miw={`${ideaCardMinWidthPx}px`}
            />
          </Stack>

          <PickedUpIdeas
            dummyProps={{
              isDummy: fetchingRecommended,
              count: 1,
            }}
            icon={
              <IconThumbUp
                width="30px"
                height="30px"
                color="var(--mantine-color-green-7)"
              />
            }
            title="おすすめのお題"
            ideas={recommendedIdeas ?? []}
          />

          <PickedUpIdeas
            dummyProps={{ isDummy: fetchingLatest }}
            icon={
              <IconBulb
                width="30px"
                height="30px"
                color="var(--mantine-color-yellow-7)"
              />
            }
            title="最新のお題"
            readMoreHref={Routes.ideaSearch({ order: "createdDesc" })}
            ideas={latestIdeas ?? []}
          />

          <PickedUpIdeas
            dummyProps={{ isDummy: fetchingLikes }}
            icon={
              <IconHeart
                width="30px"
                height="30px"
                color="var(--mantine-color-pink-7)"
              />
            }
            title="いいねが多かったお題"
            readMoreHref={Routes.ideaSearch({ order: "likeDesc" })}
            ideas={manyLikesIdeas ?? []}
          />

          <PickedUpIdeas
            dummyProps={{ isDummy: fetchingDevs }}
            icon={
              <IconCode
                width="30px"
                height="30px"
                color="var(--mantine-color-blue-7)"
              />
            }
            title="開発者が多かったお題"
            readMoreHref={Routes.ideaSearch({ order: "devDesc" })}
            ideas={manyDevsIdeas ?? []}
          />
        </Stack>

        <Flex direction="column" gap={30} visibleFrom="lg">
          <IdeaSearchByTagCard />

          <RankingCard title="いいねが多かった開発者">
            {fetchingTop10LikedDevelopers ? (
              [...new Array(10)].map((_, i) => {
                return (
                  <AppSkeleton
                    h={38}
                    key={i}
                    style={{ borderRadius: "var(--mantine-radius-md)" }}
                  />
                );
              })
            ) : top10LikedDevelopers?.length === 0 ? (
              <Box mt={100}>
                <EmptyContentItem
                  icon={
                    <IconHeart
                      width={100}
                      height={100}
                      color="var(--mantine-color-red-7)"
                    />
                  }
                  text="いいねがありません"
                  description="開発者のいいねのランキングがここに表示されます"
                />
              </Box>
            ) : (
              top10LikedDevelopers?.map((dev, i) => (
                <UserLikeRankingItem
                  ranking={i + 1}
                  key={dev.id}
                  user={dev}
                  likeCount={dev.devLikes}
                />
              ))
            )}
          </RankingCard>

          <RankingCard title="いいねが多かった投稿者">
            {fetchingTop10LikedIdeaAuthors ? (
              [...new Array(10)].map((_, i) => {
                return (
                  <AppSkeleton
                    h={38}
                    key={i}
                    style={{ borderRadius: "var(--mantine-radius-md)" }}
                  />
                );
              })
            ) : top10LikedIdeaAuthors?.length === 0 ? (
              <Box mt={100}>
                <EmptyContentItem
                  icon={
                    <IconHeart
                      width={100}
                      height={100}
                      color="var(--mantine-color-red-7)"
                    />
                  }
                  text="いいねがありません"
                  description="投稿者のいいねのランキングがここに表示されます"
                />
              </Box>
            ) : (
              top10LikedIdeaAuthors?.map((author, i) => (
                <UserLikeRankingItem
                  ranking={i + 1}
                  key={author.id}
                  user={author}
                  likeCount={author.ideaLikes}
                />
              ))
            )}
          </RankingCard>
        </Flex>
      </Flex>
    </>
  );
};
