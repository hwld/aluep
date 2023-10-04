import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { RequireLoginModalProvider } from "../src/client/features/session/RequireLoginModalProvider";
import { theme } from "../src/client/style/theme";

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
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <RequireLoginModalProvider>
              <Story />
            </RequireLoginModalProvider>
          </MantineProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
