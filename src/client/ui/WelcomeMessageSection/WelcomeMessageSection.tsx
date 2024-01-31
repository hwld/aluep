import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { trpc } from "@/client/lib/trpc";
import { WelcomeCard } from "@/client/ui/WelcomeCard/WelcomeCard";
import {
  getAppConfigCookie,
  parseCookieString,
  setAppConfigCookie,
} from "@/share/cookie";
import { useLayoutEffect, useState } from "react";

type Props = { defaultWelcomeMessageHidden?: boolean };

export const WelcomeMessageSection: React.FC<Props> = ({
  defaultWelcomeMessageHidden,
}) => {
  const { session } = useSessionQuery();
  const [welcomeMessageHidden, setWelcomeMessageHidden] = useState(
    defaultWelcomeMessageHidden ?? false
  );

  const updateMutation = trpc.me.update.useMutation();

  const handleHideWelcomeOpen = () => {
    if (session) {
      updateMutation.mutate({ welcomeMessageHidden: true });
    }

    setAppConfigCookie({ welcomeMessageHidden: true });
    setWelcomeMessageHidden(true);
  };

  // SSRをしない場合、defaultWelcomeMessageHiddenが設定されないのでcookieから読み取る
  useLayoutEffect(() => {
    if (defaultWelcomeMessageHidden !== undefined) {
      return;
    }

    const cookie = getAppConfigCookie(parseCookieString(document.cookie));
    setWelcomeMessageHidden(cookie.welcomeMessageHidden ?? false);
  }, [defaultWelcomeMessageHidden]);

  if (
    (!session && welcomeMessageHidden) ||
    session?.user.welcomeMessageHidden
  ) {
    return <></>;
  }

  return <WelcomeCard onClose={handleHideWelcomeOpen} />;
};
