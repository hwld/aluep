import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { ideaKeys } from "../idea/queryKeys";
import { userKeys } from "./queryKeys";

// 名前が長すぎる...

export const useTop10LikesDevelopmentInThisMonth = () => {
  const { data: top10LikesDevelopmentsInThisMonth, ...others } = useQuery({
    queryKey: userKeys.top10LikesDevelopmentsInThisMonth,
    queryFn: () => {
      return trpc.aggregate.getTop10LikesDevelopmentsInThisMonth.query();
    },
    // ランキングは最新のデータでなくても問題ないので、できる限りキャッシュから取ってこれるようにする
    // これをやらないと再レンダリングのたびにデータを持ってくるようになってしまう？
    staleTime: Infinity,
  });

  return { top10LikesDevelopmentsInThisMonth, ...others };
};

export const useTop10LikesPostersInThisMonth = () => {
  const { data: top10LikesPostersInThisMonth, ...others } = useQuery({
    queryKey: userKeys.top10LikesPostersInThisMonth,
    queryFn: () => {
      return trpc.aggregate.getTop10LikesPostersInThisMonth.query();
    },
    // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
    staleTime: Infinity,
  });

  return { top10LikesPostersInThisMonth, ...others };
};

export const useTop10LikesIdeasInThisMonth = () => {
  const { data: top10LikesIdeasInThisMonth, ...others } = useQuery({
    queryKey: ideaKeys.top10LikesIdeasInThisMonth,
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
