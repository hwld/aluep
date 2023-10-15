import { trpc } from "@/client/lib/trpc";

type UseDevQueryArgs = { devId: string };

export const useDevQuery = ({ devId }: UseDevQueryArgs) => {
  const { data: dev, ...others } = trpc.dev.get.useQuery({
    devId: devId,
  });

  return { dev, ...others };
};
