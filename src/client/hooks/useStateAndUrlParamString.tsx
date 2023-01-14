import { useCallback, useState } from "react";
import { useUrlParamString } from "./useUrlParamString";

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
  const [stateFromUrlParam, setStateFromUrlParam] = useUrlParamString({
    paramName,
    initialData,
    transitionOptions: { shallow: true },
    replace: true,
  });
  const [state, setState] = useState(stateFromUrlParam);

  const setStateAndUrlParam = useCallback(
    async (value: string) => {
      await setStateFromUrlParam(value);
      setState(value);
    },
    [setStateFromUrlParam]
  );

  return [state, setStateAndUrlParam] as const;
};
