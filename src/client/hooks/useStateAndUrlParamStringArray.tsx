import { useRouter } from "next/router";
import { useState } from "react";
import { urlParamToStringArray } from "../../server/lib/urlParam";

type UseStateAndUrlParamStringArrayArgs = {
  paramName: string;
  initialData: string[];
};
export const useStateAndUrlParamStringArray = ({
  paramName,
  initialData,
}: UseStateAndUrlParamStringArrayArgs) => {
  const router = useRouter();
  const urlParam = router.query[paramName];

  const [state, setState] = useState(
    urlParamToStringArray(urlParam, initialData)
  );

  const setStateAndUrlParam = async (values: string[]) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(paramName);
    values.forEach((value) => {
      url.searchParams.append(paramName, value);
    });
    await router.replace(url, undefined, { shallow: true });

    setState(values);
  };

  return [state, setStateAndUrlParam] as const;
};
