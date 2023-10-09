import { HomePage } from "@/client/pageComponents/HomePage/HomePage";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { trpcMsw } from "@/client/__mocks__/trpc";
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
  name: "少量のデータ",
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
  name: "大量のデータ",
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

export const LargeFilled: Story = {
  name: "大量の最大文字数のデータ",
  parameters: {
    msw: {
      handlers: [
        trpcMsw.session.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ expires: "", user: UserHelper.createFilled() })
          );
        }),
        trpcMsw.me.getMySummary.query((req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.data({ allLikes: 9999, developments: 9999, ideas: 9999 })
          );
        }),
        trpcMsw.aggregate.getTop10LikesIdeasInThisMonth.query(
          (req, res, ctx) => {
            const { createFilled } = IdeaHelper;
            return res(
              ctx.status(200),
              ctx.data([...new Array(6)].map(() => createFilled()))
            );
          }
        ),
        trpcMsw.aggregate.getTop10LikesDevelopmentsInThisMonth.query(
          (req, res, ctx) => {
            const { createFilled } = UserHelper;
            return res(
              ctx.status(200),
              ctx.data(
                [...new Array(10)].map(() => ({
                  ...createFilled(),
                  developmentLikes: 10,
                }))
              )
            );
          }
        ),
        trpcMsw.aggregate.getTop10LikesPostersInThisMonth.query(
          (req, res, ctx) => {
            const { createFilled } = UserHelper;
            return res(
              ctx.status(200),
              ctx.data(
                [...new Array(10)].map(() => ({
                  ...createFilled(),
                  ideaLikes: 10,
                }))
              )
            );
          }
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
