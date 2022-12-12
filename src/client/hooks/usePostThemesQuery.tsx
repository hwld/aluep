import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const postThemeQueryKey = ["postThemes"];
export const useThemeQuery = (userId: string) => {
  const { data: postThemes, ...others } = useQuery({
    queryKey: postThemeQueryKey,
    queryFn: () => {
      return trpc.user.getPostTheme.query({ userId: userId });
    },
  });

  return { postThemes, ...others };

  // const { data: postThemes } = useQuery({
  //   queryKey: ["postThemes"],
  //   queryFn: () => {
  //     return trpc.user.getPostTheme.query({ userId: user.id });
  //   },
  // });

  // export const themeQueryKey = (themeId: string) => ["theme", themeId];

  // export const useThemeQuery = (themeId: string) => {
  //   const { data: theme, ...others } = useQuery({
  //     queryKey: themeQueryKey(themeId),
  //     queryFn: () => {
  //       return trpc.theme.get.query({ themeId });
  //     },
  //   });

  //   return { theme, ...others };
};
