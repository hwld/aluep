import { render } from "@testing-library/react";
import { IdeaCard } from "./IdeaCard";

describe("IdeaCard", () => {
  it("お題のタイトルが表示されている", () => {
    const { getByText } = render(
      <IdeaCard
        idea={{
          id: "1",
          title: "title",
          comments: 0,
          likes: 0,
          developments: 0,
          createdAt: "",
          descriptionHtml: "<p>body</p>",
          elapsedSinceCreation: "",
          tags: [],
          updatedAt: "",
          user: { id: "1", image: "", name: "user" },
        }}
      />
    );

    const title = getByText("title");

    expect(title).toBeInTheDocument();
  });
});
