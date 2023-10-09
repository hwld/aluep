import { DevMemoThreadCard } from "@/client/features/devMemo/DevMemoThreadCard/DevMemoThreadCard";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { DevelopmentMemoHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = { component: DevMemoThreadCard } satisfies Meta<
  typeof DevMemoThreadCard
>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    ideaId: "",
    developmentId: "",
    memo: DevelopmentMemoHelper.create(),
    childrenMemos: [...new Array(5)].map(() => DevelopmentMemoHelper.create()),
  },
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.developmentMemo.getAll, []),
      ],
    },
  },
};
