import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

// 名前が長すぎる...

export const top10LikesDevelopmentsInThisMonthQueryKey = [
  "top10LikesDevelopmentsInThisMonth",
];
export const useTop10LikesDevelopmentInThisMonth = () => {
  const { data: top10LikesDevelopmentsInThisMonth, ...others } = useQuery({
    queryKey: top10LikesDevelopmentsInThisMonthQueryKey,
    queryFn: () => {
      return trpc.aggregate.getTop10LikesDevelopmentsInThisMonth.query();
    },
    // ランキングは最新のデータでなくても問題ないので、できる限りキャッシュから取ってこれるようにする
    // これをやらないと再レンダリングのたびにデータを持ってくるようになってしまう？
    staleTime: Infinity,
  });

  return { top10LikesDevelopmentsInThisMonth, ...others };
};

export const top10LikesPostersInThisMonthQueryKey = [
  "top10LikesPostersInThisMonth",
];
export const useTop10LikesPostersInThisMonth = () => {
  const { data: top10LikesPostersInThisMonth, ...others } = useQuery({
    queryKey: top10LikesPostersInThisMonthQueryKey,
    queryFn: () => {
      return trpc.aggregate.getTop10LikesPostersInThisMonth.query();
    },
    // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
    staleTime: Infinity,
  });

  return { top10LikesPostersInThisMonth, ...others };
};

export const top10LikesIdeasInThisMonthQueryKey = [
  "top10LikesIdeasInThisMonth",
];
export const useTop10LikesIdeasInThisMonth = () => {
  const { data: top10LikesIdeasInThisMonth, ...others } = useQuery({
    queryKey: top10LikesIdeasInThisMonthQueryKey,
    queryFn: () => {
      return trpc.aggregate.getTop10LikesIdeasInThisMonth.query();
    },
    // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
    staleTime: Infinity,
  });

  return {
    top10LikesIdeasInThisMonth: top10LikesIdeasInThisMonth ?? [],
    ...others,
  };
};
