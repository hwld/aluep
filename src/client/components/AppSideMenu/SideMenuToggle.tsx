import { ActionIcon, Box } from "@mantine/core";
import { HiArrowRight } from "react-icons/hi";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  width: string;
  className?: string;
};

export const SideMenuToggle: React.FC<Props> = ({
  isOpen,
  onToggle,
  width,
  className,
}) => {
  return (
    <ActionIcon
      className={className}
      onClick={onToggle}
      color="gray.1"
      sx={(theme) => ({
        flexShrink: 0,
        borderRadius: "50%",
        alignSelf: "flex-end",
        width,
        height: "auto",
        aspectRatio: "1",

        transition: "all 150ms",
        backgroundColor: theme.colors.red[8],
        "&:hover": { backgroundColor: theme.colors.red[5] },
      })}
    >
      <Box
        sx={{
          transition: "all 250ms",
          transform: isOpen ? "rotate(180deg)" : "none",
        }}
      >
        <HiArrowRight size={30} />
      </Box>
    </ActionIcon>
  );
};
