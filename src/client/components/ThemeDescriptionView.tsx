import { Box } from "@mantine/core";
import { useMemo } from "react";
import sanitize from "sanitize-html";
import { themeDescriptionStyles } from "./ThemeDescriptionEditor/ThemeDescriptionEditor";
import { themeDescriptionSanitizeOptions } from "./ThemeDescriptionEditor/useThemeDescriptionEditor";

type Props = { descriptionHtml: string };
export const ThemeDescriptionView: React.FC<Props> = ({ descriptionHtml }) => {
  const sanitizedHtml = useMemo(() => {
    return sanitize(descriptionHtml, themeDescriptionSanitizeOptions);
  }, [descriptionHtml]);

  return (
    <Box
      sx={themeDescriptionStyles}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    ></Box>
  );
};
