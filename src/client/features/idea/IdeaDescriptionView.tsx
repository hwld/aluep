import { Box } from "@mantine/core";
import { ideaDescriptionStyles } from "./IdeaDescriptionEditor/IdeaDescriptionEditor";

type Props = { descriptionHtml: string };
export const IdeaDescriptionView: React.FC<Props> = ({ descriptionHtml }) => {
  return (
    <Box
      sx={ideaDescriptionStyles}
      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
    ></Box>
  );
};
