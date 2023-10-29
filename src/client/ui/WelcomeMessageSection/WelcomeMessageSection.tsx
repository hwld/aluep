import { useSessionQuery } from "@/client/features/session/useSessionQuery";
import { trpc } from "@/client/lib/trpc";
import { WelcomeCard } from "@/client/ui/WelcomeCard/WelcomeCard";
import { welcomeMessageHiddenCookie } from "@/share/consts";
import { addYears } from "date-fns";
import { useState } from "react";

type Props = { defaultWelcomeMessageHidden?: boolean };

export const WelcomeMessageSection: React.FC<Props> = ({
  defaultWelcomeMessageHidden = false,
}) => {
  const { session } = useSessionQuery();
  const [welcomeMessageHidden, setWelcomeMessageHidden] = useState(
    defaultWelcomeMessageHidden
  );

  const updateMutation = trpc.me.update.useMutation({
    onSuccess: () => {},
    onError: () => {},
  });

  const handleHideWelcomeOpen = () => {
    if (session) {
      updateMutation.mutate({ welcomeMessageHidden: true });
    }

    document.cookie = `${welcomeMessageHiddenCookie}=true;expires=${addYears(
      new Date(),
      1
    )}`;
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
