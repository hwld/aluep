import { EmptyIdeaSearchResult } from "@/client/features/idea/EmptyIdeaSearchResult/EmptyIdeaSearchResult";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: EmptyIdeaSearchResult } satisfies Meta<
  typeof EmptyIdeaSearchResult
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
