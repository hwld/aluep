import { TestHelpers } from "../../tests/helper";

describe("お題開発API", () => {
  it("お題の開発情報を登録できる", async () => {
    const { caller } = await TestHelpers.createSessionCaller({
      userName: "user",
    });
    const { idea } = await TestHelpers.createIdeaAndUser();
    const repositoryUrl = "https://github.com/hwld/aluep";

    const { developmentId } = await caller.development.create({
      type: "referenceRepository",
      ideaId: idea.id,
      githubRepositoryUrl: repositoryUrl,
    });

    const development = await caller.development.get({ developmentId });
    expect(development?.githubUrl).toBe(repositoryUrl);
  });
});
