import { router } from "../../trpc";
import { createGitHubRepository } from "./createGitHubRepository";

export const githubRoute = router({
  /** GitHubリポジトリを作成する */
  createRepo: createGitHubRepository,
});
