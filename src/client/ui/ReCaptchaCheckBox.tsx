import { Box } from "@mantine/core";
import Script from "next/script";
import { useCallback, useEffect } from "react";

const getGrecaptcha = () => {
  if (typeof grecaptcha === "undefined") {
    return undefined;
  }
  return grecaptcha.enterprise;
};

const wrapperId = "g-recaptcha";

type Props = { onCheck: (token: string | undefined) => void };
export const ReCaptchaCheckBox: React.FC<Props> = ({ onCheck }) => {
  const renderReCaptureCheckBox = useCallback(() => {
    getGrecaptcha()?.ready(() => {
      const checkbox = document.querySelector(`#${wrapperId} iframe`);
      if (checkbox) {
        return;
      }

      getGrecaptcha()?.render(wrapperId, {
        sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
        callback: (token) => {
          onCheck(token === "" ? undefined : token);
        },
      });
    });
  }, [onCheck]);

  const handleLoadScript = () => {
    renderReCaptureCheckBox();
  };

  useEffect(() => {
    renderReCaptureCheckBox();
  }, [renderReCaptureCheckBox]);

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/enterprise.js"
        onLoad={handleLoadScript}
      />
      <Box id={wrapperId} />
    </>
  );
};
