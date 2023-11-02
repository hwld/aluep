// 名前が長すぎる...

import { trpc } from "@/client/lib/trpc";

export const useTop10LikedDevelopers = () => {
  const { data: top10LikedDevelopers, ...others } =
    trpc.aggregate.getPopularDevelopers.useQuery(
      { limit: 10 },
      {
        // ランキングは最新のデータでなくても問題ないので、できる限りキャッシュから取ってこれるようにする
        // これをやらないと再レンダリングのたびにデータを持ってくるようになってしまう？
        staleTime: Infinity,
      }
    );

  return {
    top10LikedDevelopers: top10LikedDevelopers,
    ...others,
  };
};

export const useTop10LikedIdeaAuthors = () => {
  const { data: top10LikedIdeaAuthors, ...others } =
    trpc.aggregate.getPopularIdeaAuthors.useQuery(
      { limit: 10 },
      {
        // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
        staleTime: Infinity,
      }
    );

  return {
    top10LikedIdeaAuthors: top10LikedIdeaAuthors,
    ...others,
  };
};

export const useTop10LikedIdeas = () => {
  const { data: top10LikedIdeas, ...others } =
    trpc.aggregate.getPopularIdeas.useQuery(
      { limit: 10 },
      {
        // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
        staleTime: Infinity,
      }
    );

  return {
    top10LikedIdeas: top10LikedIdeas,
    ...others,
  };
};
