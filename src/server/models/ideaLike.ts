import { User } from "@/server/models/user";

export type IdeaLiker = User & { likedDate: Date };
