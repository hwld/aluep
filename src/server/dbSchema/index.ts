import * as sessionsSchema from "./sessions";
import * as usersSchema from "./users";
import * as ideasSchema from "./ideas";
import * as ideaLikesSchema from "./ideaLikes";
import * as ideaCommentsSchema from "./ideaComments";
import * as ideaTagsSchema from "./ideaTags";
import * as ideaTagOnIdeasSchema from "./ideaTagOnIdeas";
import * as devsSchema from "./devs";
import * as devMemosSchema from "./devMemos";
import * as favoriteUserseSchema from "./favoriteUsers";
import * as devLikesSchema from "./devLikes";

export const dbSchema = {
  ...sessionsSchema,
  ...usersSchema,
  ...ideasSchema,
  ...ideaLikesSchema,
  ...ideaCommentsSchema,
  ...ideaTagsSchema,
  ...ideaTagOnIdeasSchema,
  ...devsSchema,
  ...devMemosSchema,
  ...favoriteUserseSchema,
  ...devLikesSchema,
} as const;
