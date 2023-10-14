import { DevelopForm } from "@/client/features/dev/DevelopForm/DevelopForm";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevStatusIds } from "@/models/developmentStatus";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevelopForm } satisfies Meta<typeof DevelopForm>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.development.getDevelopmentStatuses, [
          { id: DevStatusIds.ABORTED, name: "開発終了" },
          { id: DevStatusIds.COMPLETED, name: "開発完了" },
          { id: DevStatusIds.IN_PROGRESS, name: "開発中" },
        ]),
        mockTrpcQuery(trpcMsw.me.getMyGitHubRepositories, []),
      ],
    },
  },
  args: {
    ideaId: "",
    submitText: "開発する",
  },
};
