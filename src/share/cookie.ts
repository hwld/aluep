import { addYears } from "date-fns";
import { z } from "zod";

const cookieBool = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((v) => v === true || v === "true");

const appConfigCookieKey = "app-config";
const appConfigCookieSchema = z.object({
  welcomeMessageHidden: cookieBool.optional(),
  isSideBarOpen: cookieBool.optional(),
});
export type AppConfigCookie = z.infer<typeof appConfigCookieSchema>;

export const setAppConfigCookie = (config: AppConfigCookie) => {
  if (typeof window === "undefined") {
    throw new Error("");
  }

  const rawPrev = window.document.cookie
    .split("; ")
    .find((r) => r.startsWith(appConfigCookieKey))
    ?.split("=")[1];
  const prevData = JSON.parse(rawPrev ?? "{}");
  const parsedPrev = appConfigCookieSchema.parse(prevData);

  window.document.cookie = `${appConfigCookieKey}=${JSON.stringify({
    ...parsedPrev,
    ...config,
  })}; path=/; expires=${addYears(new Date(), 1)}`;
};

export const parseCookieString = (cookieStr: string) => {
  let cookie: Record<string, string> = Object.fromEntries(
    cookieStr.split("; ").map((v) => v.split(/=(.*)/s).map(decodeURIComponent))
  );

  return cookie;
};

export const getAppConfigCookie = (
  cookies: Partial<{
    [key: string]: string;
  }>
): AppConfigCookie => {
  const appConfig = JSON.parse(cookies[appConfigCookieKey] ?? "{}");
  const parsedAppConfig = appConfigCookieSchema.parse(appConfig);

  return parsedAppConfig;
};
