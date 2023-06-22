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
    const handleStart = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) {
        return;
      }
      if (url !== router.asPath) {
        // resetしないと、画面遷移->プログレスバーが消える直前に2画面に遷移でプログレスバーが表示されなくなることがある。
        resetNavigationProgress();
        startNavigationProgress();
      }
    };
    const handleComplete = (_: string, { shallow }: { shallow: boolean }) => {
      if (shallow) {
        return;
      }
      completeNavigationProgress();
    };
    const handleError = (
      _: unknown,
      __: unknown,
      { shallow }: { shallow: boolean }
    ) => {
      if (shallow) {
        return;
      }
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

  return (
    <NavigationProgress
      autoReset
      progressLabel="ページ読み込みのインジケータ"
      color="red.6"
      stepInterval={100}
      size={3}
    />
  );
};
