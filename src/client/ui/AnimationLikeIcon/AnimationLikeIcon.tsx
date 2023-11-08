import { SvgHeart } from "@/client/ui/Icons";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import classes from "./AnimationLikeIcon.module.css";

type Props = { liked: boolean; width?: string; height?: string };

type Animation = Parameters<SVGSVGElement["animate"]>;
const likeAnimation: Animation = [
  [
    { transform: "scale(0)" },
    { transform: "scale(1.1)", offset: 0.6 },
    { transform: "scale(1)" },
  ],
  { duration: 250 },
];

const unlikeAnimation: Animation = [
  [
    { transform: "scale(0)" },
    { transform: "scale(0.9)", offset: 0.6 },
    { transform: "scale(1)" },
  ],
  { duration: 250 },
];

export const AnimationLikeIcon: React.FC<Props> = ({
  liked,
  width = "auto",
  height = "auto",
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  const prevLikedRef = useRef(liked);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) {
      return;
    }

    if (prevLikedRef.current === liked) {
      return;
    }

    if (liked) {
      svg.animate(...likeAnimation);
    } else {
      svg.animate(...unlikeAnimation);
    }

    prevLikedRef.current = liked;
  }, [liked]);

  return (
    <SvgHeart
      ref={(el) => {
        ref.current = el;
      }}
      className={clsx(classes.icon, { [classes.liked]: liked })}
      style={{ width, height }}
    />
  );
};
