import { useQuery } from "@tanstack/react-query";
import { trpc } from "../trpc";

export const developerQuerykey = (developerId: string) => [
  "developers",
  developerId,
];

export const useDeveloperQuery = (developerId: string) => {
  const { data: developer, ...others } = useQuery({
    queryKey: developerQuerykey(developerId),
    queryFn: () => {
      return trpc.themeDeveloper.get.query({ developerId });
    },
  });

  return { developer, ...others };
};
