/**
 * next.jsのPageコンポーネントのために、ReactのFCにgetLayoutを追加する
 */

import "react";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface FunctionComponent<P = {}> {
    getLayout?: (
      page: ReactNode,
      options: {
        isSideBarOpen?: boolean;
      }
    ) => ReactNode;
  }
}
