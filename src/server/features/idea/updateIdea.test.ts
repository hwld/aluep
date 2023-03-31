import { db } from "../../lib/prismadb";
import { TestHelpers } from "../../tests/helper";

describe("お題更新API", () => {
  it("他人が投稿したお題は更新できない", async () => {
    const { caller } = await TestHelpers.createCaller({
      isLoginSession: true,
      userName: "user",
    });
    const { id: ideaId } = await TestHelpers.createUserAndIdea();

    const promise = caller.idea.update({
      ideaId,
      title: "udpated",
      descriptionHtml: "<p>udpated</p>",
      tags: [],
    });

    expect(promise).rejects.toThrow();
  });

  it("未ログインユーザーはお題を更新できない", async () => {
    const { caller } = await TestHelpers.createCaller({
      isLoginSession: false,
    });
    const { id: ideaId } = await TestHelpers.createUserAndIdea();

    const promise = caller.idea.update({
      ideaId,
      title: "t",
      descriptionHtml: "<p>t</p>",
      tags: [],
    });

    expect(promise).rejects.toThrow();
  });

  it("お題を更新できる", async () => {
    const { caller } = await TestHelpers.createCaller({
      isLoginSession: true,
      userName: "user",
    });
    const { id: tagId } = await db.ideaTag.create({ data: { name: "tag" } });
    const { ideaId } = await caller.idea.create({
      title: "title",
      descriptionHtml: "<p>body</p>",
      tags: [],
    });
    const updatedTitle = "updated";
    const updatedDescription = "<p>updated</p>";
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
