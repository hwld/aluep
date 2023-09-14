import { createGitHubRepositoryURL } from "@/server/features/github/createGitHubRepository";
import { rest } from "msw";

type MockCreateGitHubRepositoryArgs = {
  statusCode?: number;
  repositoryUrl?: string;
};
export const mockCreateGitHubRepository = ({
  statusCode = 201,
  repositoryUrl = "https://github.com/hwld/aluep",
}: MockCreateGitHubRepositoryArgs) => {
  return rest.post(createGitHubRepositoryURL, (req, res, ctx) => {
    return res(ctx.status(statusCode), ctx.json({ html_url: repositoryUrl }));
  });
};
