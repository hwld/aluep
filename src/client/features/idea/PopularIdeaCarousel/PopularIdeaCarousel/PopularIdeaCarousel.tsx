import {
  PopularIdeaCard,
  popularIdeaCardWidthPx,
} from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCard/PopularIdeaCard";
import { Idea } from "@/models/idea";
import { Carousel } from "@mantine/carousel";
import { Box, Flex } from "@mantine/core";
import classes from "./PopularIdeaCarouse.module.css";

type Props = { ideas: Idea[] | undefined; miw?: string };
export const PopularIdeaCarousel: React.FC<Props> = ({ ideas, miw }) => {
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
      {ideas && ideas.length > 0 ? (
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
