import { loadEnvConfig } from "@next/env";
import { cwd } from "process";

loadEnvConfig(cwd());

// TODO:
export const DATABASE_URL = process.env.__NEW_DATABASE_URL__ || "";
