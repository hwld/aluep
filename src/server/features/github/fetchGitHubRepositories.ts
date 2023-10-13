import { TRPCError } from "@trpc/server";
import { z } from "zod";

const repositoriesSchema = z.array(
  z.object({ name: z.string(), html_url: z.string() })
);

type Args = { accessToken: string };

type GitHubRepository = { name: string; url: string };

export const fetchGitHubRepositories = async ({
  accessToken,
}: Args): Promise<GitHubRepository[]> => {
  // TODO: いったんリポジトリ数100だけにするが、あとでページング実装してinfinite query使えるようにしたい
  const apiUrl = new URL("https://api.github.com/user/repos");
  apiUrl.searchParams.append("visibility", "public");
  apiUrl.searchParams.append("sort", "updated");
  apiUrl.searchParams.append("per_page", "100");
  apiUrl.searchParams.append("page", "1");

  let response;
  try {
    response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  switch (response.status) {
    case 200:
      break;
    case 401:
      throw new TRPCError({ code: "UNAUTHORIZED" });
    default:
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  const json = await response.json();
  const result = repositoriesSchema.safeParse(json);
  if (!result.success) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
  const repositories = result.data;

  return repositories.map((r) => ({ name: r.name, url: r.html_url }));
};
