import { Box } from "@mantine/core";
import { themeDescriptionStyles } from "./ThemeDescriptionEditor/ThemeDescriptionEditor";

type Props = { descriptionHtml: string };
export const ThemeDescriptionView: React.FC<Props> = ({ descriptionHtml }) => {
  return (
    <Box
      sx={themeDescriptionStyles}
      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
    ></Box>
  );
};
