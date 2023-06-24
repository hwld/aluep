import { User } from "@/models/user";

export type IdeaLiker = User & { likedDate: Date };
