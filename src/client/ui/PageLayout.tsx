import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import { RequireLoginModalProvider } from "@/client/features/session/RequireLoginModalProvider";
import { theme } from "@/client/style/theme";
import { AppLayout } from "@/client/ui/AppLayout/AppLayout";
import { AppNavigationProgress } from "@/client/ui/AppNavigationProgress";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";
import { PageProps } from "@/server/lib/GetServerSidePropsWithReactQuery";

type Props = Pick<PageProps, "isSideBarOpen"> & { children: ReactNode };

export const PageLayout: React.FC<Props> = ({ isSideBarOpen, children }) => {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <RequireLoginModalProvider>
          <Notifications />
          <AppLayout isSideBarOpen={isSideBarOpen}>
            <AppNavigationProgress />
            {children}
          </AppLayout>
        </RequireLoginModalProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};
