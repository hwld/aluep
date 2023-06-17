import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export const developmentQuerykey = (developmentId: string) =>
  ["developments", developmentId] as const;

export const useDevelopmentQuery = (developmentId: string) => {
  const { data: development, ...others } = useQuery({
    queryKey: developmentQuerykey(developmentId),
    queryFn: () => {
      return trpc.development.get.query({ developmentId: developmentId });
    },
  });

  return { development, ...others };
};
