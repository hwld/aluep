import { router } from "../../lib/trpc";
import { createGitHubRepository } from "./createGitHubRepository";

export const githubRoute = router({
  /** GitHubリポジトリを作成する */
  createRepo: createGitHubRepository,
});
