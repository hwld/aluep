import { useIdeaDescriptionEditor } from "@/client/features/idea/useIdeaDescriptionEditor";
import { RichTextEditor } from "@mantine/tiptap";
import { Meta, StoryObj } from "@storybook/react";
import { RichTextEditorImageUploader } from "./RichTextEditorImageUploader";

const meta = {
  component: RichTextEditorImageUploader,
} satisfies Meta<typeof RichTextEditorImageUploader>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  decorators: [
    (Story) => {
      const editor = useIdeaDescriptionEditor({});
      return (
        <RichTextEditor editor={editor}>
          <Story />
        </RichTextEditor>
      );
    },
  ],
};
