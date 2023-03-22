import { Box } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Idea } from "../../../server/models/idea";
import { IdeaCard, ideaCardMinWidthPx } from "./IdeaCard/IdeaCard";

type Props = PropsWithChildren & { ideas: Idea[] };
export const IdeaCardContainer: React.FC<Props> = ({ children, ideas }) => {
  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${ideaCardMinWidthPx}px, 1fr))`,
        gridAutoRows: "max-content",
        gap: theme.spacing.md,
      })}
    >
      {ideas.map((idea) => {
        return <IdeaCard key={idea.id} idea={idea} />;
      })}
    </Box>
  );
};
