import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { fakeString, IdeaTagHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";
import { IdeaSearchByTagCard } from "./IdeaSearchByTagCard";

const meta = {
  component: IdeaSearchByTagCard,
} satisfies Meta<typeof IdeaSearchByTagCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(
          trpcMsw.aggregate.getPopularIdeaTags,
          [...new Array(10)].map(() => {
            return {
              ...IdeaTagHelper.create({
                name: fakeString({ min: 0, max: 10 }),
              }),
              ideaCount: 10,
            };
          })
        ),
      ],
    },
  },
};

export const Empty: Story = {};
