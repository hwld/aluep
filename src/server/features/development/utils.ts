import { DevelopmentFormData } from "../../../share/schema";
import { createGitHubRepository } from "../github/createGitHubRepository";

/**
 * formからGitHubRepositoryのURLを取得する。
 * typeがcreateRepositoryだったらGitHubリポジトリを作成してからURLを返す
 */
export const createOrExtractGithubRepositoryUrl = async (
  form: DevelopmentFormData,
  userId: string
): Promise<string> => {
  if (form.type === "createRepository") {
    const githubRepositoryUrl = await createGitHubRepository({
      repositoryName: form.githubRepositoryName,
      repositoryDescription: form.githubRepositoryDescription ?? "",
      userId: userId,
    });
    return githubRepositoryUrl;
  } else if (form.type === "referenceRepository") {
    return form.githubRepositoryUrl;
  }

  throw new Error();
};
