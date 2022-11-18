import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const sessionQuerykey = ["session"];

export const useSessionQuery = () => {
  const { data: session, ...others } = useQuery(["session"], () => {
    return trpc.session.query();
  });

  return { session, ...others };
};
