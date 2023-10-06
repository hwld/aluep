import { IdeaDescriptionEditor } from "@/client/features/idea/IdeaDescriptionEditor/IdeaDescriptionEditor/IdeaDescriptionEditor";
import { useIdeaDescriptionEditor } from "@/client/features/idea/IdeaDescriptionEditor/useIdeaDescriptionEditor";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: IdeaDescriptionEditor } satisfies Meta<
  typeof IdeaDescriptionEditor
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { editor: null, error: true },
  render: function Render(props) {
    const editor = useIdeaDescriptionEditor({
      content: "",
    });

    return <IdeaDescriptionEditor {...props} editor={editor} />;
  },
};
