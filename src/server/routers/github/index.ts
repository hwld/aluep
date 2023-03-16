import { router } from "../../lib/trpc";
import { createGitHubRepositoryRoute } from "./createGitHubRepository";

export const githubRoute = router({
  /** GitHubリポジトリを作成する */
  createRepo: createGitHubRepositoryRoute,
});
