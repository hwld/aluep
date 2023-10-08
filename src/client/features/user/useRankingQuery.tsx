// 名前が長すぎる...

import { trpc } from "@/client/lib/trpc";

export const useTop10LikesDevelopmentInThisMonth = () => {
  const { data: top10LikesDevelopmentsInThisMonth, ...others } =
    trpc.aggregate.getTop10LikesDevelopmentsInThisMonth.useQuery(undefined, {
      // ランキングは最新のデータでなくても問題ないので、できる限りキャッシュから取ってこれるようにする
      // これをやらないと再レンダリングのたびにデータを持ってくるようになってしまう？
      staleTime: Infinity,
    });

  return {
    top10LikesDevelopmentsInThisMonth: top10LikesDevelopmentsInThisMonth ?? [],
    ...others,
  };
};

export const useTop10LikesPostersInThisMonth = () => {
  const { data: top10LikesPostersInThisMonth, ...others } =
    trpc.aggregate.getTop10LikesPostersInThisMonth.useQuery(undefined, {
      // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
      staleTime: Infinity,
    });

  return {
    top10LikesPostersInThisMonth: top10LikesPostersInThisMonth ?? [],
    ...others,
  };
};

export const useTop10LikesIdeasInThisMonth = () => {
  const { data: top10LikesIdeasInThisMonth, ...others } =
    trpc.aggregate.getTop10LikesIdeasInThisMonth.useQuery(undefined, {
      // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
      staleTime: Infinity,
    });

  return {
    top10LikesIdeasInThisMonth: top10LikesIdeasInThisMonth ?? [],
    ...others,
  };
};
