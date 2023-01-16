import {
  completeNavigationProgress,
  NavigationProgress,
  resetNavigationProgress,
  startNavigationProgress,
} from "@mantine/nprogress";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const AppNavigationProgress = () => {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        startNavigationProgress();
      }
    };
    const handleComplete = () => {
      completeNavigationProgress();
    };
    const handleError = () => {
      resetNavigationProgress();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router.asPath, router.events]);

  return <NavigationProgress autoReset color="gray.0" stepInterval={100} />;
};
