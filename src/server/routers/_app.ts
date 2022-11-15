import { router } from "../trpc";
import { githubRoute } from "./github";
import { themesRoute } from "./themes";
import { meRoute } from "./users/me";

export const appRouter = router({
  users: router({ me: meRoute }),
  themes: themesRoute,
  github: githubRoute,
});

export type AppRouter = typeof appRouter;
