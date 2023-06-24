import { User } from "@/server/models/user";

export type DevelopmentLikers = User & { likedDate: Date };
