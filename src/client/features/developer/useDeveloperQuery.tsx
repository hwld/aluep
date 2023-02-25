import { useQuery } from "@tanstack/react-query";
import { trpc } from "../../lib/trpc";

export const developerQuerykey = (developerId: string) => [
  "developers",
  developerId,
];

export const useDeveloperQuery = (developerId: string) => {
  const { data: developer, ...others } = useQuery({
    queryKey: developerQuerykey(developerId),
    queryFn: () => {
      return trpc.developer.get.query({ developerId });
    },
  });

  return { developer, ...others };
};
