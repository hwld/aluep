import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { userQueryKey } from "../user/useUserQuery";

export const userDevelopmentsPerPageQueryKey = (
  userId: string,
  page: number
) => [
  ...userQueryKey(userId),
  "user-developmens",
  { page: isNaN(page) ? 1 : page },
];

export const useUserDevelopmentsPerPage = (userId: string, page: number) => {
  const { data: userDevelopmentsPerPage, ...others } = useQuery({
    queryKey: userDevelopmentsPerPageQueryKey(userId, page),
    queryFn: () => {
      return trpc.development.getDevelopmentsByUser.query({ userId, page });
    },
    keepPreviousData: true,
  });

  return { userDevelopmentsPerPage, ...others };
};
