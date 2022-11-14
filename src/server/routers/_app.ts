import { router } from "../trpc";
import { meRoute } from "./users/me";

export const appRouter = router({
  users: router({ me: meRoute }),
  themes: router({}),
});

export type AppRouter = typeof appRouter;
