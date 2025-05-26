import 'dotenv/config';
import '@testing-library/jest-dom';

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    { current: null }, // emblaRef
    {
      scrollNext: jest.fn(),
      scrollPrev: jest.fn(),
      canScrollNext: jest.fn(() => true),
      canScrollPrev: jest.fn(() => true),
      selectedScrollSnap: jest.fn(() => 0),
      scrollSnapList: jest.fn(() => [0, 1, 2]),
      on: jest.fn(),
      off: jest.fn(),
    }, // emblaApi
  ],
}));

jest.mock('embla-carousel-autoplay', () => {
  return jest.fn(() => ({
    init: jest.fn(),
    destroy: jest.fn(),
    name: 'autoplay',
  }));
});