import { ActionIcon, Button, MediaQuery, Tooltip } from "@mantine/core";
import Link from "next/link";
import { ReactNode, SyntheticEvent } from "react";

type Props = {
  href: string;
  icon: ReactNode;
  onClick?: (e: SyntheticEvent) => void;
  text: string;
};

export const AppHeaderLinkButton: React.FC<Props> = ({
  text,
  href,
  icon,
  onClick,
}) => {
  const textButton = () => {
    return (
      <Button
        component={Link}
        bg="gray.0"
        c="red.7"
        sx={(theme) => ({
          "&:hover": {
            backgroundColor: theme.colors.gray[1],
          },
        })}
        href={href}
        leftIcon={icon}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  };

  const IconButton = () => {
    return (
      <Tooltip position="bottom" label={text}>
        <ActionIcon
          component={Link}
          href={href}
          onClick={onClick}
          bg="gray.0"
          c="red.7"
          size="lg"
          sx={(theme) => ({
            "&:hover": { backgroundColor: theme.colors.gray[1] },
          })}
        >
          {icon}
        </ActionIcon>
      </Tooltip>
    );
  };

  return (
    <>
      {/* mdより小さいときはtextButtonを隠す */}
      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
        {textButton()}
      </MediaQuery>
      {/* mdより大きいときはiconButtonを隠す */}
      <MediaQuery largerThan="md" styles={{ display: "none" }}>
        {IconButton()}
      </MediaQuery>
    </>
  );
};
