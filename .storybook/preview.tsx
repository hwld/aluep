import { RequireLoginModalProvider } from "@/client/features/session/RequireLoginModalProvider";
import { theme } from "@/client/style/theme";
import { mockTRPC, mockTRPCClient } from "@/client/__mocks__/trpc";
import "@mantine/carousel/styles.layer.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "@mantine/tiptap/styles.layer.css";
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { useState } from "react";

initialize({ serviceWorker: { url: "/apiMockServiceWorker.js" } });

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    mswDecorator,
    (Story) => {
      const [queryClient] = useState(
        () =>
          new QueryClient({
            defaultOptions: {
              queries: { retry: false, refetchOnWindowFocus: false },
            },
          })
      );
      const [mockTrpcClient] = useState(() => mockTRPCClient);

      return (
        <mockTRPC.Provider client={mockTrpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
              <RequireLoginModalProvider>
                <Story />
              </RequireLoginModalProvider>
            </MantineProvider>
          </QueryClientProvider>
        </mockTRPC.Provider>
      );
    },
  ],
};

export default preview;
