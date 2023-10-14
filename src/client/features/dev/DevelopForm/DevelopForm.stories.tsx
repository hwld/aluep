import { DevelopForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopForm } satisfies Meta<typeof DevelopForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [mockTrpcQuery(trpcMsw.me.getMyGitHubRepositories, [])],
    },
  },
  args: {
    ideaId: "",
    submitText: "開発する",
  },
};
