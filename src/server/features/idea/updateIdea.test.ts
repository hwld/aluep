import { db } from "@/server/lib/prismadb";
import { TestHelpers } from "@/server/tests/helper";

describe("お題更新API", () => {
  it("他人が投稿したお題は更新できない", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();

    const promise = caller.idea.update({
      ideaId: idea.id,
      title: "udpated",
      descriptionHtml: "<p>udpated</p>",
      tags: [],
    });

    await expect(promise).rejects.toThrow();
  });

  it("未ログインユーザーはお題を更新できない", async () => {
    const { caller } = await TestHelpers.createPublicCaller();
    const { idea } = await TestHelpers.createIdeaAndUser();

    const promise = caller.idea.update({
      ideaId: idea.id,
      title: "t",
      descriptionHtml: "<p>t</p>",
      tags: [],
    });

    await expect(promise).rejects.toThrow();
  });

  it("お題を更新できる", async () => {
    const { caller } = await TestHelpers.createNewUserSessionCaller();
    const { id: tagId } = await db.ideaTag.create({ data: { name: "tag" } });
    const html = "<html><head></head><body><p>updated</p></body></html>";
    const { ideaId } = await caller.idea.create({
      title: "title",
      descriptionHtml: html,
      tags: [],
    });
    const updatedTitle = "updated";
    const updatedDescription = html;
    const udpatedTags = [tagId];

    await caller.idea.update({
      ideaId,
      title: updatedTitle,
      descriptionHtml: updatedDescription,
      tags: udpatedTags,
    });

    const updatedIdea = await caller.idea.get({ ideaId });
    expect(updatedIdea?.title).toStrictEqual(updatedTitle);
    expect(updatedIdea?.descriptionHtml).toStrictEqual(updatedDescription);
    expect(updatedIdea?.tags.length).toBe(1);
    expect(updatedIdea?.tags[0].id).toBe(tagId);
  });
});
