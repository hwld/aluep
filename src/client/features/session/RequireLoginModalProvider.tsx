import { createContext, PropsWithChildren, useContext, useState } from "react";

type RequireLoginModalContext = {
  isLoginModalOpen: boolean;
  openLoginModal: (callbackUrl?: string) => void;
  closeLoginModal: () => void;
  callbackUrlAfterLogin?: string;
};
const requireLoginModalContext = createContext<
  RequireLoginModalContext | undefined
>(undefined);

export const RequireLoginModalProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [callbackUrlAfterLogin, setCallbackUrlAfterLogin] = useState<
    string | undefined
  >(undefined);

  const openLoginModal = (callbackUrl?: string) => {
    if (callbackUrl) {
      setCallbackUrlAfterLogin(callbackUrl);
    } else {
      setCallbackUrlAfterLogin(undefined);
    }

    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <requireLoginModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        callbackUrlAfterLogin,
      }}
    >
      {children}
    </requireLoginModalContext.Provider>
  );
};

export const useRequireLoginModal = () => {
  const context = useContext(requireLoginModalContext);
  if (!context) {
    throw new Error("LoginModalProviderが必要です");
  }
  return context;
};
