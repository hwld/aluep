import {
  PopularIdeaCard,
  popularIdeaCardWidthPx,
} from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCard/PopularIdeaCard";
import { AppSkeleton } from "@/client/ui/AppSkeleton/AppSkeleton";
import { Idea } from "@/models/idea";
import { Carousel } from "@mantine/carousel";
import { Box, Flex } from "@mantine/core";
import classes from "./PopularIdeaCarouse.module.css";

type Props = {
  ideas: Idea[];
  miw?: string;
  dummyProps?: { isDummy: boolean; count?: number };
};
export const PopularIdeaCarousel: React.FC<Props> = ({
  ideas,
  miw,
  dummyProps,
}) => {
  return (
    <Carousel
      align="center"
      loop
      slideSize={`${popularIdeaCardWidthPx}px`}
      miw={miw}
      slideGap="md"
      bg="red.7"
      withIndicators
      height={300}
      dragFree
      classNames={{
        root: classes.root,
        control: classes.control,
      }}
      styles={{
        indicators: { bottom: "10px" },
        indicator: { backgroundColor: "var(--mantine-color-gray-1)" },
        controls: { top: "calc(50% - 25px)" },
      }}
    >
      {dummyProps?.isDummy ? (
        [...new Array(dummyProps.count ?? 6)].map((_, i) => {
          return (
            <Carousel.Slide key={i}>
              <Flex h="100%" w={`${popularIdeaCardWidthPx}px`} align="center">
                <Box w="100%" h="200px">
                  <AppSkeleton h="100%" w="100%" />
                </Box>
              </Flex>
            </Carousel.Slide>
          );
        })
      ) : ideas.length > 0 ? (
        ideas.map((idea) => (
          <Carousel.Slide key={idea.id}>
            <Flex h="100%" w={`${popularIdeaCardWidthPx}px`} align="center">
              <Box w="100%" h="200px">
                <PopularIdeaCard idea={idea} />
              </Box>
            </Flex>
          </Carousel.Slide>
        ))
      ) : (
        <Box></Box>
      )}
    </Carousel>
  );
};
