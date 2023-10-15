import { MutedText } from "@/client/ui/MutedText/MutedText";
import { TextLink } from "@/client/ui/TextLink/TextLink";
import { Dev } from "@/models/dev";
import { Routes } from "@/share/routes";
import { Text } from "@mantine/core";

type Props = { dev: Dev; className?: string };

export const DeveloperTitle: React.FC<Props> = ({ dev, className }) => {
  return (
    <TextLink href={Routes.dev(dev.ideaId, dev.id)} className={className}>
      <Text fw="bold" size="lg">
        {dev.developer.name}
        <MutedText span>{" の開発"}</MutedText>
      </Text>
    </TextLink>
  );
};
