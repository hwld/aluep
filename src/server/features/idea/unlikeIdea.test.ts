import { TestHelpers } from "@/server/tests/helper";

describe("お題へいいね解除API", () => {
  it("いいね解除できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();
    await caller.idea.like({ ideaId: idea.id });

    await caller.idea.unlike({ ideaId: idea.id });

    const changedIdea = await caller.idea.get({ ideaId: idea.id });
    expect(changedIdea?.likedByLoggedInUser).toBe(false);
  });
});
