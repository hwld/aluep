import { useRouter } from "next/router";
import { useMemo } from "react";
import { urlParamToString } from "../../server/lib/urlParam";

type UseUrlParamStringArgs = {
  paramName: string;
  initialData: string;
  transitionOptions?: { shallow?: boolean; scroll?: boolean };
  replace?: boolean;
};

export const useUrlParamString = ({
  paramName,
  initialData,
  transitionOptions = { shallow: false, scroll: true },
  replace = false,
}: UseUrlParamStringArgs) => {
  const router = useRouter();
  const rawUrlParma = router.query[paramName];

  const urlParam = useMemo(() => {
    return urlParamToString(rawUrlParma, initialData);
  }, [initialData, rawUrlParma]);

  const setUrlParam = (value: string) => {
    const url = new URL(window.location.href);
    if (value === "") {
      url.searchParams.delete(paramName);
    } else {
      url.searchParams.set(paramName, value);
    }

    let method;
    if (replace) {
      method = router.replace;
    } else {
      method = router.push;
    }
    method(url, undefined, transitionOptions);
  };

  return [urlParam, setUrlParam] as const;
};
