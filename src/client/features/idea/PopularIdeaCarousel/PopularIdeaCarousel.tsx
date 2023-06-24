import {
  PopularIdeaCard,
  popularIdeaCardWidthPx,
} from "@/client/features/idea/PopularIdeaCarousel/PopularIdeaCard";
import { Idea } from "@/models/idea";
import { Carousel } from "@mantine/carousel";
import { Box, Flex } from "@mantine/core";

type Props = { ideas: Idea[] | undefined; miw?: string };
export const PopularIdeaCarousel: React.FC<Props> = ({ ideas, miw }) => {
  const carouselControlClass = `controls-vcb4f`;

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
      styles={(theme) => ({
        indicators: { bottom: "10px" },
        control: {
          ref: carouselControlClass,
          "&>svg": { width: "30px", height: "30px" },
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          opacity: 0,
          transition: "opacity 400ms, background-color 250ms",
          backgroundColor: theme.fn.rgba(theme.colors.gray[0], 0.6),
          "&:hover": {
            backgroundColor: theme.fn.rgba(theme.colors.gray[0], 1),
          },
        },
        controls: { top: "calc(50% - 25px)" },
        root: {
          "&:hover": {
            [`& .${carouselControlClass}`]: {
              opacity: 0.7,
            },
          },
        },
      })}
      sx={(theme) => ({
        borderRadius: theme.radius.lg,
        boxShadow: `inset ${theme.shadows.lg}`,
      })}
      nextControlLabel="次のお題に進める"
      previousControlLabel="前のお題に戻る"
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
