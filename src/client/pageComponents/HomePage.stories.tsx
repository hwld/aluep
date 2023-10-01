import { trpcMsw } from "@/client/__mocks__/trpc";
import { HomePage } from "@/client/pageComponents/HomePage";
import { AppLayout } from "@/client/ui/AppLayout";
import { IdeaHelper, UserHelper } from "@/models/tests/helpers";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof HomePage> = {
  title: "Page/HomePage",
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
};
export default meta;
type Story = StoryObj<typeof HomePage>;

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.aggregate.getTop10LikesIdeasInThisMonth.query(
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.data([]));
          }
        ),
        trpcMsw.aggregate.getTop10LikesDevelopmentsInThisMonth.query(
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.data([]));
          }
        ),
        trpcMsw.aggregate.getTop10LikesPostersInThisMonth.query(
          (req, res, ctx) => {
            return res(ctx.status(200), ctx.data([]));
          }
        ),
        trpcMsw.aggregate.getPickedIdeas.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data([]));
        }),
      ],
    },
  },
};

export const Small: Story = {
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
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
        trpcMsw.aggregate.getTop10LikesDevelopmentsInThisMonth.query(
          (req, res, ctx) => {
            const { create } = UserHelper;
            return res(
              ctx.status(200),
              ctx.data([{ ...create(), developmentLikes: 3 }])
            );
          }
        ),
        trpcMsw.aggregate.getTop10LikesPostersInThisMonth.query(
          (req, res, ctx) => {
            const { create } = UserHelper;
            return res(
              ctx.status(200),
              ctx.data([{ ...create(), ideaLikes: 5 }])
            );
          }
        ),
        trpcMsw.aggregate.getTop10LikesIdeasInThisMonth.query(
          (req, res, ctx) => {
            const { create } = IdeaHelper;
            return res(ctx.status(200), ctx.data([create()]));
          }
        ),
      ],
    },
  },
};

export const Large: Story = {
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(ctx.status(200), ctx.data(null));
        }),
        trpcMsw.aggregate.getTop10LikesIdeasInThisMonth.query(
          (req, res, ctx) => {
            const { create } = IdeaHelper;
            return res(
              ctx.status(200),
              ctx.data([...new Array(6)].map(() => create()))
            );
          }
        ),
        trpcMsw.aggregate.getTop10LikesDevelopmentsInThisMonth.query(
          (req, res, ctx) => {
            const { create } = UserHelper;
            return res(
              ctx.status(200),
              ctx.data(
                [...new Array(10)].map(() => ({
                  ...create(),
                  developmentLikes: 10,
                }))
              )
            );
          }
        ),
        trpcMsw.aggregate.getTop10LikesPostersInThisMonth.query(
          (req, res, ctx) => {
            const { create } = UserHelper;
            return res(
              ctx.status(200),
              ctx.data(
                [...new Array(10)].map(() => ({ ...create(), ideaLikes: 10 }))
              )
            );
          }
        ),
        trpcMsw.aggregate.getPickedIdeas.query((req, res, ctx) => {
          const { order } = req.getInput();
          const { create } = IdeaHelper;

          switch (order) {
            case "createdDesc": {
              return res(
                ctx.status(200),
                ctx.data([...new Array(6)].map(() => create()))
              );
            }
            case "likeDesc": {
              return res(
                ctx.status(200),
                ctx.data([...new Array(6)].map(() => create()))
              );
            }
            case "developmentDesc": {
              return res(
                ctx.status(200),
                ctx.data([...new Array(6)].map(() => create()))
              );
            }
          }

          return res(ctx.status(200), ctx.data([]));
        }),
      ],
    },
  },
};
