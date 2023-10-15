import { TestHelpers } from "@/server/tests/helper";

describe("開発情報へのいいねAPI", () => {
  it("いいねできる", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });
    const { caller } = await TestHelpers.createNewUserSessionCaller();

    await caller.dev.like({ devId: dev.id });

    const gettedDev = await caller.dev.get({
      devId: dev.id,
    });
    expect(gettedDev).not.toBeUndefined();
    const liked = gettedDev!.likedByLoggedInUser;
    expect(liked).toBe(true);
  });

  it("未ログインユーザーは開発情報にいいねすることはできない", async () => {
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });
    const { caller } = await TestHelpers.createPublicCaller();

    const promise = caller.dev.like({ devId: dev.id });

    await expect(promise).rejects.toThrow();
  });

  it("自分の開発情報にいいねすることはできない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { devId } = await caller.dev.create({
      ideaId: idea.id,
      githubRepositoryUrl: "https://github.com/hwld/aluep",
      status: "IN_PROGRESS",
    });

    const promise = caller.dev.like({ devId: devId });

    await expect(promise).rejects.toThrow();
  });

  it("2回いいねすることはできない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });
    await caller.dev.like({ devId: dev.id });

    const promise = caller.dev.like({ devId: dev.id });

    await expect(promise).rejects.toThrow();
  });
});
