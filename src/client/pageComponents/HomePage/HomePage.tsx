import { EmptyHomeIdeas } from "@/client/features/idea/EmptyHomeIdeas/EmptyHomeIdeas";
import { ideaCardMinWidthPx } from "@/client/features/idea/IdeaCard/IdeaCard";
import { PickedUpIdeas } from "@/client/features/idea/PickedUpIdeas/PickedUpIdeas";
import { PopularIdeaCarousel } from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCarousel/PopularIdeaCarousel";
import { usePickedUpIdeasQuery } from "@/client/features/idea/usePickedUpIdeasQuery";
import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { UserLikeRankingItem } from "@/client/features/user/UserLikeRankingItem/UserLikeRankingItem";
import {
  useTop10LikesDevelopmentInThisMonth,
  useTop10LikesIdeasInThisMonth,
  useTop10LikesPostersInThisMonth,
} from "@/client/features/user/useRankingQuery";
import { EmptyRankingContent } from "@/client/ui/EmptyRankingContent/EmptyRankingContent";
import { PageHeader } from "@/client/ui/PageHeader/PageHeader";
import { RankingCard } from "@/client/ui/RankingCard/RankingCard";
import { Routes } from "@/share/routes";
import {
  Center,
  Flex,
  MediaQuery,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { AiFillFire } from "react-icons/ai";
import { IoSparkles } from "react-icons/io5";
import { MdComputer, MdOutlineHome } from "react-icons/md";
import { TbHeart } from "react-icons/tb";

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
    <>
      <PageHeader icon={MdOutlineHome} pageName="ホーム" />
      <Flex w="100%" gap="xl">
        <Stack miw={0} sx={{ flexGrow: 1, flexShrink: 1 }} spacing={35}>
          {top10LikesIdeasInThisMonth.length > 0 && (
            <Stack spacing="sm">
              <Flex gap="5px">
                <AiFillFire size="25px" color={colors.red[6]} />
                <Title order={4}>人気のお題</Title>
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
              <PickedUpIdeas
                icon={<IoSparkles size="25px" color={colors.yellow[7]} />}
                title="最新のお題"
                readMoreHref={Routes.ideaSearch({ order: "createdDesc" })}
                ideas={latestIdeas}
              />
              {manyLikesIdeas.length !== 0 && (
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
              )}
              {manyDevelopmentsIdeas.length !== 0 && (
                <PickedUpIdeas
                  icon={<MdComputer size="30px" color={colors.blue[7]} />}
                  title="開発者が多かったお題"
                  readMoreHref={Routes.ideaSearch({ order: "developmentDesc" })}
                  ideas={manyDevelopmentsIdeas}
                />
              )}
            </>
          )}
        </Stack>
        <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
          <Flex direction="column" gap={30} mt={35}>
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
    </>
  );
};
