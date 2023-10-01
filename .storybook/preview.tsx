import { MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { RequireLoginModalProvider } from "../src/client/features/session/RequireLoginModalProvider";
import { theme } from "../src/client/style/theme";

initialize();

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
      const queryClient = new QueryClient();
      return (
        <QueryClientProvider client={queryClient}>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
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
