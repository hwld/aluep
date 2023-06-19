import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";
import { sessionKeys } from "./queryKeys";

export const useSessionQuery = () => {
  const { data: session, ...others } = useQuery({
    queryKey: sessionKeys.session,
    queryFn: () => {
      return trpc.session.query();
    },
  });

  return { session, ...others };
};
