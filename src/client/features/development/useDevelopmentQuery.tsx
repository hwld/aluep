import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { developmentKeys } from "./queryKeys";

export const useDevelopmentQuery = (developmentId: string) => {
  const { data: development, ...others } = useQuery({
    queryKey: developmentKeys.detail(developmentId),
    queryFn: () => {
      return trpc.development.get.query({ developmentId: developmentId });
    },
  });

  return { development, ...others };
};
