import { TestHelpers } from "@/server/tests/helper";
import { DevelopmentStatusIds } from "@/share/consts";

describe("開発情報更新API", () => {
  it("他人の開発情報は更新できない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });

    const promise = caller.development.update({
      type: "referenceRepository",
      githubRepositoryUrl: "https://github.com/hwld/me",
      developmentStatusId: DevelopmentStatusIds.ABORTED,
      developmentId: development.id,
      comment: "new comment",
      ideaId: development.ideaId,
    });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインユーザーは更新できない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });

    const promise = caller.development.update({
      developmentId: development.id,
      ideaId: development.ideaId,
      type: "referenceRepository",
      developmentStatusId: DevelopmentStatusIds.ABORTED,
      githubRepositoryUrl: "https://github.com/hwld/me",
      comment: "new comment",
    });

    await expect(promise).rejects.toThrow();
  });

  it("開発情報を更新できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { developmentId } = await caller.development.create({
      ideaId: idea.id,
      type: "referenceRepository",
      developmentStatusId: DevelopmentStatusIds.IN_PROGRESS,
      githubRepositoryUrl: "https://github.com/hwld/me",
      comment: "comment",
    });
    const updatedStatusId = DevelopmentStatusIds.COMPLETED;
    const updatedRepoUrl = "https://github.com/hwld/me2";
    const updatedComment = "new comment";

    await caller.development.update({
      developmentId,
      ideaId: idea.id,
      type: "referenceRepository",
      developmentStatusId: updatedStatusId,
      githubRepositoryUrl: updatedRepoUrl,
      comment: updatedComment,
    });

    const updatedDevelop = await caller.development.get({ developmentId });
    expect(updatedDevelop?.status.id).toBe(updatedStatusId);
    expect(updatedDevelop?.githubUrl).toBe(updatedRepoUrl);
    expect(updatedDevelop?.comment).toBe(updatedComment);
  });
});
