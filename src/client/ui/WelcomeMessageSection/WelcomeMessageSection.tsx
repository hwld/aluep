import { WelcomeCard } from "@/client/ui/WelcomeCard/WelcomeCard";
import { welcomeMessageHiddenCookie } from "@/share/consts";
import { useState } from "react";

type Props = { defaultWelcomeMessageHidden?: boolean };

export const WelcomeMessageSection: React.FC<Props> = ({
  defaultWelcomeMessageHidden = false,
}) => {
  const [welcomeMessageHidden, setWelcomeMessageHidden] = useState(
    defaultWelcomeMessageHidden
  );

  const handleHideWelcomeOpen = () => {
    document.cookie = `${welcomeMessageHiddenCookie}=true`;
    setWelcomeMessageHidden(true);
  };

  if (welcomeMessageHidden) {
    return <></>;
  }

  return <WelcomeCard onClose={handleHideWelcomeOpen} />;
};
