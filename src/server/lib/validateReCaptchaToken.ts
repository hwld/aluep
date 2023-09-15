import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
const client = new RecaptchaEnterpriseServiceClient({
  keyFilename:
    process.env.NODE_ENV === "development"
      ? "./recaptcha-key.json"
      : "/recaptcha/key.json",
});

export const validateReCaptchaToken = async (
  token: string
): Promise<boolean> => {
  const projectPath = client.projectPath("aluep-web");

  const [response] = await client.createAssessment({
    assessment: {
      event: {
        token,
        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
      },
    },
    parent: projectPath,
  });

  if (!response.tokenProperties?.valid) {
    console.error(
      "The CreateAssessment call failed because the token was: " +
        response.tokenProperties?.invalidReason
    );

    return false;
  }

  const score = response.riskAnalysis?.score ?? 0;
  console.log(`The reCAPTCHA score is ${score}`);
  response.riskAnalysis?.reasons?.forEach((reason) => {
    console.log(reason);
  });

  if (score > 0.5) {
    return true;
  } else {
    return false;
  }
};
