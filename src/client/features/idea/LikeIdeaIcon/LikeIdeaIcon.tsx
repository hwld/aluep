import { Flex } from "@mantine/core";
import classes from "./LikeIdeaIcon.module.css";

const styles = {
  sm: { iconSize: 25, wrapperSize: 35 },
  md: { iconSize: 35, wrapperSize: 45 },
  lg: { iconSize: 40, wrapperSize: 50 },
};

type Props = { size?: "sm" | "md" | "lg" };
export const LikeIdeaIcon: React.FC<Props> = ({ size = "md" }) => {
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
        viewBox={`0 0 84 76`}
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
          d="M61.166 39.93v-3.819a3 3 0 0 0-.864-2.107L48.516 22.06a3 3 0 0 0-2.135-.893h-16.5c-2.06 0-4.026.829-5.47 2.292a7.81 7.81 0 0 0-2.245 5.485v22.57l6 5.943V28.944c0-.484.19-.94.517-1.27.324-.33.756-.507 1.198-.507h13.5v6.555c0 1.416.555 2.783 1.555 3.797a5.342 5.342 0 0 0 3.802 1.592h6.428v18.453l6-5.942V39.93ZM42.442 70.168l6.058-6H34.94l6.058 6h1.443Zm-2.859-30.224.007-.012a3 3 0 0 0-2.637-4.43h-2.358a3 3 0 0 0-2.637 4.43l.004.008a3 3 0 0 0 2.633 1.561h2.357a3 3 0 0 0 2.631-1.557Zm11.409-6.832-1.611-1.633v1.633h1.61ZM34.595 45.056a3 3 0 1 0 0 6h14.143a3 3 0 0 0 0-6H34.595Zm0 9.555a3 3 0 1 0 0 6h14.143a3 3 0 0 0 0-6H34.595Z"
          fill={borderColor}
        />
      </svg>
    </Flex>
  );
};
