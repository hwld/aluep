import { Box } from "@mantine/core";
import editorClasses from "../IdeaDescriptionEditor/IdeaDescriptionEditor/IdeaDescriptionEditor.module.css";

type Props = { descriptionHtml: string };
export const IdeaDescriptionView: React.FC<Props> = ({ descriptionHtml }) => {
  return (
    <Box
      className={editorClasses.content}
      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
    ></Box>
  );
};
