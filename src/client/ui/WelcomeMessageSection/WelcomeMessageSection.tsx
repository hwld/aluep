import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { trpc } from "@/client/lib/trpc";
import { WelcomeCard } from "@/client/ui/WelcomeCard/WelcomeCard";
import { setAppConfigCookie } from "@/share/cookie";
import { useState } from "react";

type Props = { defaultWelcomeMessageHidden?: boolean };

export const WelcomeMessageSection: React.FC<Props> = ({
  defaultWelcomeMessageHidden = false,
}) => {
  const { session } = useSessionQuery();
  const [welcomeMessageHidden, setWelcomeMessageHidden] = useState(
    defaultWelcomeMessageHidden
  );

  const updateMutation = trpc.me.update.useMutation();

  const handleHideWelcomeOpen = () => {
    if (session) {
      updateMutation.mutate({ welcomeMessageHidden: true });
    }

    setAppConfigCookie({ welcomeMessageHidden: true });
    setWelcomeMessageHidden(true);
  };

  if (
    (!session && welcomeMessageHidden) ||
    session?.user.welcomeMessageHidden
  ) {
    return <></>;
  }

  return <WelcomeCard onClose={handleHideWelcomeOpen} />;
};
