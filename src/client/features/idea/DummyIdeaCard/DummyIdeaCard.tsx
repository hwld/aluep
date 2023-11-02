import {
  ideaCardHeightPx,
  ideaCardMinWidthPx,
} from "@/client/features/idea/IdeaCard/IdeaCard";
import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import classes from "./DummyIdeaCard.module.css";

type Props = {};

export const DummyIdeaCard: React.FC<Props> = () => {
  return (
    <ItemCard
      miw={ideaCardMinWidthPx}
      h={ideaCardHeightPx}
      className={classes.root}
    />
  );
};
