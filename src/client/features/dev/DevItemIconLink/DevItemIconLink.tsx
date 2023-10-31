import { DevCardIconLink } from "@/client/features/dev/DevCardLinkIcon/DevCardLinkIcon";
import { IconLink } from "@tabler/icons-react";

type Props = { url: string };
export const DevItemIconLink: React.FC<Props> = ({ url }) => {
  return (
    <DevCardIconLink
      label="開発したものを見に行く"
      url={url}
      icon={
        <IconLink
          width="80%"
          height="80%"
          color="var(--mantine-color-gray-7)"
        />
      }
    />
  );
};
