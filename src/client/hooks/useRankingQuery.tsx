import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const top10LikesDevelopersInThisMonthQueryKey = [
  "top10LikesDevelopersInThisMonth",
];

export const useTop10LikesDeveloperInThisMonth = () => {
  const { data: top10LikesDevelopersInThisMonth, ...others } = useQuery({
    queryKey: top10LikesDevelopersInThisMonthQueryKey,
    queryFn: () => {
      return trpc.theme.getTop10LikesDevelopersInThisMonth.query();
    },
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
  });

  return { top10LikesPostersInThisMonth, ...others };
};
