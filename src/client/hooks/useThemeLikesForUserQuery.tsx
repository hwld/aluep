import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const themeLikesForUserQueryKey = (userId: string) => [
  "themeLikesForUser",
  userId,
];

/** 指定されたユーザーが投稿したお題すべてについた「いいね」の合計 */
export const useThemeLikesForUserQuery = (userId: string) => {
  const { data: themeLikes, ...others } = useQuery({
    queryKey: themeLikesForUserQueryKey(userId),
    queryFn: () => {
      return trpc.user.getThemeLike.query({ userId });
    },
  });

  return { themeLikes, ...others };
};
