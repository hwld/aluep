import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { developmentKeys } from "./queryKeys";

type UseDevelopmentQueryArgs = { developmentId: string };

export const useDevelopmentQuery = ({
  developmentId,
}: UseDevelopmentQueryArgs) => {
  const { data: development, ...others } = useQuery({
    queryKey: developmentKeys.detail(developmentId),
    queryFn: () => {
      return trpc.development.get.query({ developmentId: developmentId });
    },
  });

  return { development, ...others };
};
