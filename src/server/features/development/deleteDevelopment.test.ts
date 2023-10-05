import { TestHelpers } from "@/server/tests/helper";
import { DevStatusIds } from "@/share/consts";

describe("お題開発情報削除API", () => {
  it("開発情報を削除できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { developmentId } = await caller.development.create({
      type: "referenceRepository",
      githubRepositoryUrl: "https://github.com/hwld/aluep",
      ideaId: idea.id,
      developmentStatusId: DevStatusIds.IN_PROGRESS,
    });

    await caller.development.delete({ developmentId });

    const development = await caller.development.get({ developmentId });
    expect(development).toBeUndefined();
  });

  it("自分以外の開発情報は削除できない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });

    const promise = caller.development.delete({
      developmentId: development.id,
    });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインでは開発情報を削除できない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    const { development } = await TestHelpers.createDevelopmentAndUser({
      ideaId: idea.id,
    });

    const promise = caller.development.delete({
      developmentId: development.id,
    });

    await expect(promise).rejects.toThrow();
  });
});
