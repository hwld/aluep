import { TestHelpers } from "@/server/tests/helper";

describe("お題開発API", () => {
  it("未ログインではお題の開発情報を登録できない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();

    const promise = caller.dev.create({
      ideaId: idea.id,
      githubRepositoryUrl: "https://github.com/hwld/aluep",
      status: "IN_PROGRESS",
    });

    await expect(promise).rejects.toThrow();
  });

  it("既存のリポジトリを指定してお題の開発情報を登録できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const repositoryUrl = "https://github.com/hwld/aluep";

    const { devId } = await caller.dev.create({
      ideaId: idea.id,
      githubRepositoryUrl: repositoryUrl,
      status: "COMPLETED",
    });

    const dev = await caller.dev.get({ devId });
    expect(dev?.githubUrl).toBe(repositoryUrl);
    expect(dev?.status).toBe("COMPLETED");
  });
});
