import { DevelopmentFormData } from "@/models/development";
import { createGitHubRepository } from "@/server/features/github/createGitHubRepository";

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
