import { TestHelpers } from "../../tests/helper";

describe("server/features/idea/createIdea.ts", () => {
  it("ログインしていないとお題を作成することはできない", async () => {
    const caller = await TestHelpers.createCaller({ isLoginSession: false });

    const promise = caller.idea.create({
      title: "test-title",
      descriptionHtml: "<p>test</p>",
      tags: [],
    });

    expect(promise).rejects.toThrow();
  });

  it("お題を作成し、作成したお題を取得することができる", async () => {
    const caller = await TestHelpers.createCaller({
      isLoginSession: true,
      userName: "user",
    });
    const title = "test-title";
    const descriptionHtml = "<p>test-description</p>";

    const { ideaId } = await caller.idea.create({
      title,
      descriptionHtml: descriptionHtml,
      tags: [],
    });

    const idea = await caller.idea.get({ ideaId: ideaId });
    expect(idea?.title).toStrictEqual(title);
    expect(idea?.descriptionHtml).toStrictEqual(descriptionHtml);
  });

  describe("XSS対策", () => {
    it.each([
      ['<script>alert("XSS")</script>', ""],
      [
        '<a href="javascript:alert("XSS")" target="_blank">link</a>',
        '<a target="_blank">link</a>',
      ],
    ])('"%s" -> "%s"', async (input, expected) => {
      const caller = await TestHelpers.createCaller({
        isLoginSession: true,
        userName: "user",
      });
      const { ideaId } = await caller.idea.create({
        title: "title",
        descriptionHtml: input,
        tags: [],
      });

      const idea = await caller.idea.get({ ideaId });
      expect(idea?.descriptionHtml).toStrictEqual(expected);
    });
  });
});
