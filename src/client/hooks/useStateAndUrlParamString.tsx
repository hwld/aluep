import { useRouter } from "next/router";
import { useState } from "react";

// React Stateと併せてURLパラメータに文字列を保存する。
// 初回レンダリングではURLパラメータが存在すればそれを初期値に設定する

type UseStateAndUrlParamStringArgs = {
  paramName: string;
  initialData: string;
};
export const useStateAndUrlParamString = ({
  paramName,
  initialData,
}: UseStateAndUrlParamStringArgs) => {
  const router = useRouter();
  const urlParam = router.query[paramName];

  const [state, setState] = useState(
    typeof urlParam === "object"
      ? urlParam[0]
      : typeof urlParam === "string"
      ? urlParam
      : initialData
  );

  const setStateAndUrlParam = (value: string) => {
    const url = new URL(window.location.href);
    if (value === "") {
      url.searchParams.delete(paramName);
    } else {
      url.searchParams.set(paramName, value);
    }
    router.push(url, undefined, { shallow: true });

    setState(value);
  };

  return [state, setStateAndUrlParam] as const;
};
