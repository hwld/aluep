import { CardActionLinkButton } from "@/client/ui/CardActionButton/CardActionButton";
import { IconLink } from "@tabler/icons-react";

type Props = { url: string };
export const DevItemIconLink: React.FC<Props> = ({ url }) => {
  return (
    <CardActionLinkButton
      label="成果物を見に行く"
      url={url}
      icon={<IconLink />}
    />
  );
};
