import { TestHelpers } from "@/server/tests/helper";

describe("開発情報へのいいねAPI", () => {
  it("いいねできる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });
    const { caller } = await TestHelpers.createNewUserSessionCaller();

    await caller.development.like({ developmentId: development.id });

    const dev = await caller.development.get({
      developmentId: development.id,
    });
    expect(dev).not.toBeUndefined();
    const liked = dev!.likedByLoggedInUser;
    expect(liked).toBe(true);
  });

  it("未ログインユーザーは開発情報にいいねすることはできない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });
    const { caller } = await TestHelpers.createPublicCaller();

    const promise = caller.development.like({ developmentId: development.id });

    await expect(promise).rejects.toThrow();
  });

  it("自分の開発情報にいいねすることはできない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { developmentId } = await caller.development.create({
      ideaId: idea.id,
      githubRepositoryUrl: "https://github.com/hwld/aluep",
      status: "IN_PROGRESS",
    });

    const promise = caller.development.like({ developmentId });

    await expect(promise).rejects.toThrow();
  });

  it("2回いいねすることはできない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });
    await caller.development.like({ developmentId: development.id });

    const promise = caller.development.like({ developmentId: development.id });

    await expect(promise).rejects.toThrow();
  });
});
