import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { developmentKeys } from "./queryKeys";

/** ユーザーが開発した開発情報を取得する */
export const useUserDevelopmentsPerPage = (userId: string, page: number) => {
  const { data: userDevelopmentsPerPage, ...others } = useQuery({
    queryKey: developmentKeys.listByUserPerPage(userId, page),
    queryFn: () => {
      return trpc.development.getDevelopmentsByUser.query({ userId, page });
    },
    keepPreviousData: true,
  });

  return { userDevelopmentsPerPage, ...others };
};
