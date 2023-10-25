import { TestHelpers } from "@/server/tests/helper";

describe("お題開発情報削除API", () => {
  it("開発情報を削除できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { devId } = await caller.dev.create({
      githubRepositoryUrl: "https://github.com/hwld/aluep",
      ideaId: idea.id,
      status: "IN_PROGRESS",
    });

    await caller.dev.delete({ devId });

    const promise = caller.dev.get({ devId });
    await expect(promise).rejects.toThrow();
  });

  it("自分以外の開発情報は削除できない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });

    const promise = caller.dev.delete({
      devId: dev.id,
    });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインでは開発情報を削除できない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });

    const promise = caller.dev.delete({
      devId: dev.id,
    });

    await expect(promise).rejects.toThrow();
  });
});
