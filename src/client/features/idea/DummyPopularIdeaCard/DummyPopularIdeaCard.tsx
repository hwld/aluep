import { ItemCard } from "@/client/ui/ItemCard/ItemCard";
import classes from "./DummyPopularIdeaCard.module.css";
type Props = {};

export const DummyPopularIdeaCard: React.FC<Props> = () => {
  return <ItemCard h="100%" className={classes.root} />;
};
