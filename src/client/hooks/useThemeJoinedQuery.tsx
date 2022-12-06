import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";
import { useSessionQuery } from "./useSessionQuery";
import { themeQueryKey } from "./useThemeQuery";

export const themeJoinQueryKey = (
  themeId: string,
  loggedInUserId: string | undefined
) => [...themeQueryKey(themeId), "user", loggedInUserId ?? "", "joined"];

// ログインユーザーが指定されたお題に参加しているかを返す
export const useThemeJoinQuery = (themeId: string) => {
  const { session } = useSessionQuery();

  const { data: joined, ...others } = useQuery({
    queryKey: themeJoinQueryKey(themeId, session?.user.id),
    queryFn: () => {
      return trpc.theme.joined.query({ themeId });
    },
  });

  return { joined, ...others };
};
