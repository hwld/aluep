import { AppRouter } from "@/server/router";
import { httpLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createTRPCMsw } from "msw-trpc";
import SuperJSON from "superjson";

const apiUrl = "http://localhost:6006/api/trpc";

export const mockTRPC = createTRPCReact<AppRouter>();
export const mockTRPCClient = mockTRPC.createClient({
  links: [httpLink({ url: apiUrl })],
  transformer: SuperJSON,
});

/**
 * mswのhandlerとして使用するtRPCのclient
 * 上はStorybookの上で動いているコンポーネントのtrpcをモックするが、
 * こちらはStorybookのmswのハンドラとして使用する
 */
export const trpcMsw = createTRPCMsw<AppRouter>({
  baseUrl: apiUrl,
  transformer: { output: SuperJSON, input: SuperJSON },
});

// TODO: エラーなく型を付けられなかった・・・
type InputData<Query extends any> = Parameters<
  /** @ts-ignore */
  Parameters<Parameters<Query["query"]>[0]>[2]["data"]
>[0];

// TODO: エラーなく型を付けられなかった・・・
export const mockTrpcQuery = <T>(
  route: T,
  data: InputData<T> | (() => InputData<T>)
) => {
  const query: any = (route as any).query;
  return query((req: any, res: any, ctx: any) => {
    const _data = typeof data === "function" ? (data as any)() : data;

    return res(ctx.status(200), ctx.data(_data));
  });
};
