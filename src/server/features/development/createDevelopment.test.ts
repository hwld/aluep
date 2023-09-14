import { mockCreateGitHubRepository } from "@/server/features/github/mock";
import { server } from "@/server/mock/server";
import { TestHelpers } from "@/server/tests/helper";
import { DevelopmentStatusIds } from "@/share/consts";

describe("お題開発API", () => {
  it("未ログインではお題の開発情報を登録できない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();

    const promise = caller.development.create({
      type: "referenceRepository",
      ideaId: idea.id,
      githubRepositoryUrl: "https://github.com/hwld/aluep",
      developmentStatusId: DevelopmentStatusIds.IN_PROGRESS,
    });

    await expect(promise).rejects.toThrow();
  });

  it("既存のリポジトリを指定してお題の開発情報を登録できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const repositoryUrl = "https://github.com/hwld/aluep";

    const { developmentId } = await caller.development.create({
      type: "referenceRepository",
      ideaId: idea.id,
      githubRepositoryUrl: repositoryUrl,
      developmentStatusId: DevelopmentStatusIds.COMPLETED,
    });

    const development = await caller.development.get({ developmentId });
    expect(development?.githubUrl).toBe(repositoryUrl);
    expect(development?.status.id).toBe(DevelopmentStatusIds.COMPLETED);
  });

  it("リポジトリの作成とお題の開発情報の登録ができる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const repositoryUrl = "https://github.com/hwld/test";
    server.use(mockCreateGitHubRepository({ repositoryUrl }));

    const { developmentId } = await caller.development.create({
      ideaId: idea.id,
      type: "createRepository",
      githubRepositoryName: "repo",
      githubRepositoryDescription: "desc",
      comment: "comment",
    });

    const development = await caller.development.get({ developmentId });
    expect(development?.githubUrl).toBe(repositoryUrl);
  });
});
