import { ideaDescriptionStyles } from "@/client/features/idea/IdeaDescriptionEditor/IdeaDescriptionEditor";
import { Box } from "@mantine/core";

type Props = { descriptionHtml: string };
export const IdeaDescriptionView: React.FC<Props> = ({ descriptionHtml }) => {
  return (
    <Box
      sx={ideaDescriptionStyles}
      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
    ></Box>
  );
};
