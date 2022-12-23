import { useRouter } from "next/router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type PageLoadingContextState = { loadingValue: number };

const PageLoadingContext = createContext<PageLoadingContextState>({
  loadingValue: 0,
});

type Props = PropsWithChildren;
export const PageLoadingContextProvider: React.FC<Props> = ({ children }) => {
  const [loadingValue, setLoadingValue] = useState(0);
  const router = useRouter();
  const timerIdRef = useRef(0);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      //値をリセットする
      setLoadingValue(0);

      // 既存のタイマーをキャンセルして、新しいタイマーで始める
      window.clearInterval(timerIdRef.current);
      // 100ms毎に値を1ずつ増やしていく
      timerIdRef.current = window.setInterval(() => {
        setLoadingValue((v) => v + 3);
      }, 100);
    };

    const handleRouteChangeComplete = () => {
      // 既存のタイマーをキャンセルする
      window.clearInterval(timerIdRef.current);
      // 値を最大まで上げる
      setLoadingValue(100);
      window.setTimeout(() => setLoadingValue(0), 500);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  });

  return (
    <PageLoadingContext.Provider value={{ loadingValue }}>
      {children}
    </PageLoadingContext.Provider>
  );
};

export const usePageLoading = () => useContext(PageLoadingContext);
