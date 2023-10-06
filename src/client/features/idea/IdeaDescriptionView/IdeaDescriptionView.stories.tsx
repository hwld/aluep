import { IdeaDescriptionView } from "@/client/features/idea/IdeaDescriptionView/IdeaDescriptionView";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaDescriptionView } satisfies Meta<
  typeof IdeaDescriptionView
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    descriptionHtml: `
      <p>
        <strong>Bold</strong>
      </p>

      <p>
        <s>Strike</s>
      </p>

      <h1>Header1</h1>
      <h2>Header2</h2>
      <h3>Header3</h3>
      <h4>Header4</h4>
      <h5>Header5</h5>
      <h6>Header6</h6>

      <p>
        <br class="ProseMirror-trailingBreak">
      </p>

      <ul>
        <li>
          <p>ulist-item1</p>
        </li>
        <li>
          <p>ulist-item2</p>
        </li>
        <li>
          <p>ulist-item3</p>
        </li>
      </ul>
      
      <ol>
        <li>
          <p>olist-item1</p>
        </li>
        <li>
          <p>olist-item2</p>
        </li>
        <li>
          <p>olist-item3</p>
        </li>
      </ol>
      
      <p>
        <a rel="noopener noreferrer nofollow" href="https://example.com">
          Link
        </a>
      </p>
      `,
  },
};
