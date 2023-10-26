import { Box } from "@mantine/core";
import editorClasses from "../IdeaDescriptionEditor/IdeaDescriptionEditor.module.css";

type Props = { descriptionHtml: string };
export const IdeaDescriptionView: React.FC<Props> = ({ descriptionHtml }) => {
  return (
    <Box
      style={{ padding: "var(--mantine-spacing-md) var(--mantine-spacing-xl)" }}
      className={editorClasses.content}
      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
    ></Box>
  );
};
