import { Button, ButtonProps } from "@mantine/core";
import { MdPostAdd } from "react-icons/md";

type Props = ButtonProps & React.ComponentPropsWithoutRef<"button">;

export const AppHeaderButton: React.FC<Props> = (props) => {
  return (
    <Button
      leftIcon={<MdPostAdd size={25} />}
      bg="gray.0"
      c="red.7"
      sx={(theme) => ({
        "&:hover": {
          backgroundColor: theme.colors.gray[1],
        },
      })}
      {...props}
    >
      {props.children}
    </Button>
  );
};
