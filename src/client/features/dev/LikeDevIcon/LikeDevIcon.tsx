import { Flex } from "@mantine/core";
import classes from "./LikeDevIcon.module.css";

const styles = {
  sm: { iconSize: 25, wrapperSize: 35 },
  md: { iconSize: 35, wrapperSize: 45 },
  lg: { iconSize: 40, wrapperSize: 50 },
};

type Props = { size?: "sm" | "md" | "lg" };
export const LikeDevIcon: React.FC<Props> = ({ size = "md" }) => {
  const borderColor = "var(--mantine-color-red-7)";

  return (
    <Flex
      justify="center"
      align="center"
      w={styles[size].wrapperSize}
      h={styles[size].wrapperSize}
      className={classes.root}
    >
      <svg
        width={styles[size].iconSize}
        height={styles[size].iconSize}
        viewBox="0 0 84 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M72.97 39.93 41.72 70.88 10.47 39.93m0 0a20.833 20.833 0 1 1 31.25-27.358 20.833 20.833 0 1 1 31.25 27.384"
          fill="none"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.768 8.427a16.667 16.667 0 0 0-13.391 28.518l.026.025L41.72 65.016 70.039 36.97c.086-.085.175-.166.267-.242A16.666 16.666 0 1 0 45.05 15.077a4.167 4.167 0 0 1-6.674-.019 16.668 16.668 0 0 0-11.61-6.63Zm48.847 34.75L44.653 73.84a4.167 4.167 0 0 1-5.864 0L7.55 42.904A25 25 0 0 1 41.738 6.43a25.005 25.005 0 0 1 24.216-5.16 25 25 0 0 1 9.937 41.658c-.09.088-.181.17-.276.248Z"
          fill={borderColor}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32.176 24.811a2.74 2.74 0 0 1 0 3.916L24.79 36l7.386 7.273a2.74 2.74 0 0 1 0 3.916 2.843 2.843 0 0 1-3.977 0l-9.375-9.23a2.739 2.739 0 0 1 0-3.917l9.375-9.23a2.843 2.843 0 0 1 3.977 0ZM50.824 24.811a2.843 2.843 0 0 1 3.977 0l9.375 9.23a2.739 2.739 0 0 1 0 3.917l-9.375 9.23a2.843 2.843 0 0 1-3.977 0 2.74 2.74 0 0 1 0-3.915L58.21 36l-7.386-7.273a2.74 2.74 0 0 1 0-3.916ZM44.846 25.091c1.545.386 2.466 1.879 2.057 3.335l-5.21 18.544c-.409 1.456-1.993 2.324-3.539 1.938-1.545-.385-2.466-1.878-2.057-3.334l5.21-18.544c.409-1.456 1.993-2.324 3.539-1.939Z"
          fill={borderColor}
        />
      </svg>
    </Flex>
  );
};
