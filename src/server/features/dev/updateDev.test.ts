import { TestHelpers } from "@/server/tests/helper";

describe("開発情報更新API", () => {
  it("他人の開発情報は更新できない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });

    const promise = caller.dev.update({
      githubRepositoryUrl: "https://github.com/hwld/me",
      status: "ABORTED",
      devId: dev.id,
      comment: "new comment",
      ideaId: dev.ideaId,
    });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインユーザーは更新できない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { dev } = await TestHelpers.createDevAndUser({
      ideaId: idea.id,
    });

    const promise = caller.dev.update({
      devId: dev.id,
      ideaId: dev.ideaId,
      status: "ABORTED",
      githubRepositoryUrl: "https://github.com/hwld/me",
      comment: "new comment",
    });

    await expect(promise).rejects.toThrow();
  });

  it("開発情報を更新できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { devId } = await caller.dev.create({
      ideaId: idea.id,
      status: "IN_PROGRESS",
      githubRepositoryUrl: "https://github.com/hwld/me",
      comment: "comment",
    });
    const updatedRepoUrl = "https://github.com/hwld/me2";
    const updatedComment = "new comment";

    await caller.dev.update({
      devId: devId,
      ideaId: idea.id,
      status: "COMPLETED",
      githubRepositoryUrl: updatedRepoUrl,
      comment: updatedComment,
    });

    const updatedDevelop = await caller.dev.get({ devId: devId });
    expect(updatedDevelop?.status).toBe("COMPLETED");
    expect(updatedDevelop?.githubUrl).toBe(updatedRepoUrl);
    expect(updatedDevelop?.comment).toBe(updatedComment);
  });
});
