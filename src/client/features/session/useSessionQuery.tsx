import { trpc } from "@/client/lib/trpc";

export const useSessionQuery = () => {
  const sessionQuery = trpc.session.useQuery();
  return { session: sessionQuery.data, ...sessionQuery };
};
