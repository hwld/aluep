import { trpc } from "@/client/lib/trpc";

type UseDevelopmentQueryArgs = { developmentId: string };

export const useDevQuery = ({ developmentId }: UseDevelopmentQueryArgs) => {
  const { data: development, ...others } = trpc.development.get.useQuery({
    developmentId,
  });

  return { development, ...others };
};
