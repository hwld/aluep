import { router } from "../trpc";
import { themesRoute } from "./themes";
import { meRoute } from "./users/me";

export const appRouter = router({
  users: router({ me: meRoute }),
  themes: themesRoute,
});

export type AppRouter = typeof appRouter;
