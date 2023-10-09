import { HomePage } from "@/client/pageComponents/HomePage/HomePage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { mockTrpcQuery, trpcMsw } from "@/client/__mocks__/trpc";
import { IdeaHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Page/ホーム",
  component: HomePage,
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
} satisfies Meta<typeof HomePage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: "空のデータ",
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
        mockTrpcQuery(trpcMsw.aggregate.getTop10LikesIdeasInThisMonth, []),
        mockTrpcQuery(trpcMsw.aggregate.getTop10LikesPostersInThisMonth, []),
        mockTrpcQuery(
          trpcMsw.aggregate.getTop10LikesDevelopmentsInThisMonth,
          []
        ),
        mockTrpcQuery(trpcMsw.aggregate.getPickedIdeas, []),
      ],
    },
  },
};

export const Small: Story = {
  name: "少量のデータ",
  parameters: {
    msw: {
      handlers: [
        mockTrpcQuery(trpcMsw.session, null),
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
                ctx.data([create({ likes: 5, developments: 1 })])
              );
            }
            case "developmentDesc": {
              return res(
                ctx.status(200),
                ctx.data([
                  create({ likes: 2, developments: 20, comments: 100 }),
                ])
              );
            }
          }

          return res(ctx.status(200), ctx.data([]));
        }),
        mockTrpcQuery(trpcMsw.aggregate.getTop10LikesIdeasInThisMonth, [
          IdeaHelper.create(),
        ]),
        mockTrpcQuery(trpcMsw.aggregate.getTop10LikesPostersInThisMonth, [
          { ...UserHelper.create(), ideaLikes: 5 },
        ]),
        mockTrpcQuery(trpcMsw.aggregate.getTop10LikesDevelopmentsInThisMonth, [
          { ...UserHelper.create(), developmentLikes: 3 },
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
        mockTrpcQuery(trpcMsw.session, {
          user: UserHelper.createFilled(),
          expires: "",
        }),
        mockTrpcQuery(trpcMsw.me.getMySummary, {
          allLikes: 100,
          developments: 100,
          ideas: 100,
        }),
        mockTrpcQuery(
          trpcMsw.aggregate.getTop10LikesIdeasInThisMonth,
          [...new Array(6)].map(() => IdeaHelper.createFilled())
        ),
        mockTrpcQuery(
          trpcMsw.aggregate.getTop10LikesDevelopmentsInThisMonth,
          [...new Array(6)].map(() => ({
            ...UserHelper.createFilled(),
            developmentLikes: 10,
          }))
        ),
        mockTrpcQuery(
          trpcMsw.aggregate.getTop10LikesPostersInThisMonth,
          [...new Array(6)].map(() => ({
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
            case "developmentDesc": {
              return res(
                ctx.status(200),
                ctx.data([...new Array(6)].map(() => createFilled()))
              );
            }
          }

          return res(ctx.status(200), ctx.data([]));
        }),
      ],
    },
  },
};
