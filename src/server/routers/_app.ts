import { router } from "../trpc";
import { developersRoute } from "./developers";
import { githubRoute } from "./github";
import { themesRoute } from "./themes";
import { meRoute } from "./users/me";

export const appRouter = router({
  users: router({ me: meRoute }),
  themes: themesRoute,
  developers: developersRoute,
  github: githubRoute,
});

export type AppRouter = typeof appRouter;
