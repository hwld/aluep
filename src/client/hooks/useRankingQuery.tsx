import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

// 名前が長すぎる...

export const top10LikesDevelopersInThisMonthQueryKey = [
  "top10LikesDevelopersInThisMonth",
];
export const useTop10LikesDeveloperInThisMonth = () => {
  const { data: top10LikesDevelopersInThisMonth, ...others } = useQuery({
    queryKey: top10LikesDevelopersInThisMonthQueryKey,
    queryFn: () => {
      return trpc.theme.getTop10LikesDevelopersInThisMonth.query();
    },
    // ランキングは最新のデータでなくても問題ないので、できる限りキャッシュから取ってこれるようにする
    // これをやらないと再レンダリングのたびにデータを持ってくるようになってしまう？
    staleTime: Infinity,
  });

  return { top10LikesDevelopersInThisMonth, ...others };
};

export const top10LikesPostersInThisMonthQueryKey = [
  "top10LikesPostersInThisMonth",
];
export const useTop10LikesPostersInThisMonth = () => {
  const { data: top10LikesPostersInThisMonth, ...others } = useQuery({
    queryKey: top10LikesPostersInThisMonthQueryKey,
    queryFn: () => {
      return trpc.theme.getTop10LikesPostersInThisMonth.query();
    },
    // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
    staleTime: Infinity,
  });

  return { top10LikesPostersInThisMonth, ...others };
};

export const top10LikesThemesInThisMonthQueryKey = [
  "top10LikesThemesInThisMonth",
];
export const useTop10LikesThemesInThisMonth = () => {
  const { data: top10LikesThemesInThisMonth, ...others } = useQuery({
    queryKey: top10LikesThemesInThisMonthQueryKey,
    queryFn: () => {
      return trpc.theme.getTop10LikesThemesInThisMonth.query();
    },
    // ランキングは最新のデータではなくても問題ないので、できる限りキャッシュから取ってこれるようにする
    staleTime: Infinity,
  });

  return { top10LikesThemesInThisMonth, ...others };
};
