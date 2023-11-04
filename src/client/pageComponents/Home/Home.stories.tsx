import { Home } from "@/client/pageComponents/Home/Home";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper, IdeaTagHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/ホーム",
  component: Home,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      return (
        <AppLayout>
          <Story />
        </AppLayout>
      );
    },
  ],
} satisfies Meta<typeof Home>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: "空のデータ",
};

export const Small: Story = {
  name: "少量のデータ",
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.idea.getRecommendedIdeas, [IdeaHelper.create()]),
        trpcMsw.aggregate.getPickedIdeas.query((req, res, ctx) => {
          const { order } = req.getInput();
          const { create } = IdeaHelper;

          switch (order) {
            case "createdDesc": {
              return res(ctx.status(200), ctx.data([create()]));
            }
            case "likeDesc": {
              return res(
                ctx.status(200),
                ctx.data([create({ likes: 5, devs: 1 })])
              );
            }
            case "devDesc": {
              return res(
                ctx.status(200),
                ctx.data([create({ likes: 2, devs: 20, comments: 100 })])
              );
            }
          }

          return res(ctx.status(200), ctx.data([]));
        }),
        mockTrpcQuery(trpcMsw.aggregate.getPopularIdeas, [IdeaHelper.create()]),
        mockTrpcQuery(trpcMsw.aggregate.getPopularIdeaAuthors, [
          { ...UserHelper.create(), ideaLikes: 5 },
        ]),
        mockTrpcQuery(trpcMsw.aggregate.getPopularDevelopers, [
          { ...UserHelper.create(), devLikes: 3 },
        ]),
        mockTrpcQuery(trpcMsw.aggregate.getPopularIdeaTags, [
          { ...IdeaTagHelper.create(), ideaCount: 10 },
        ]),
      ],
    },
  },
};

export const LargeFilled: Story = {
  name: "大量の最大文字数のデータ",
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(
          trpcMsw.idea.getRecommendedIdeas,
          [...new Array(6)].map((_) => IdeaHelper.create())
        ),
        mockTrpcQuery(trpcMsw.me.getMySummary, {
          allLikes: 100,
          devs: 100,
          ideas: 100,
        }),
        mockTrpcQuery(
          trpcMsw.aggregate.getPopularIdeas,
          [...new Array(6)].map(() => IdeaHelper.createFilled())
        ),
        mockTrpcQuery(
          trpcMsw.aggregate.getPopularDevelopers,
          [...new Array(10)].map(() => ({
            ...UserHelper.createFilled(),
            devLikes: 10,
          }))
        ),
        mockTrpcQuery(
          trpcMsw.aggregate.getPopularIdeaAuthors,
          [...new Array(10)].map(() => ({
            ...UserHelper.createFilled(),
            ideaLikes: 10,
          }))
        ),
        trpcMsw.aggregate.getPickedIdeas.query((req, res, ctx) => {
          const { order } = req.getInput();
          const { createFilled } = IdeaHelper;

          switch (order) {
            case "createdDesc": {
              return res(
                ctx.status(200),
                ctx.data([...new Array(6)].map(() => createFilled()))
              );
            }
            case "likeDesc": {
              return res(
                ctx.status(200),
                ctx.data([...new Array(6)].map(() => createFilled()))
              );
            }
            case "devDesc": {
              return res(
                ctx.status(200),
                ctx.data([...new Array(6)].map(() => createFilled()))
              );
            }
          }

          return res(ctx.status(200), ctx.data([]));
        }),
        mockTrpcQuery(
          trpcMsw.aggregate.getPopularIdeaTags,
          [...new Array(10)].map(() => {
            return {
              ...IdeaTagHelper.create(),
              ideaCount: 99,
            };
          })
        ),
      ],
    },
  },
};
