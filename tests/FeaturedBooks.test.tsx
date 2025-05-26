import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturedBooks from '@/components/shared/books/FeaturedBooks';

import { mockBook } from '@/__mocks__/mocks';

describe('FeaturedBooks', () => {
  it('renders title and books grid', () => {
    render(<FeaturedBooks books={mockBook} />);
    expect(screen.getByText(/Featured Books/i)).toBeInTheDocument();
    expect(screen.getByText(/The Great Adventure/i)).toBeInTheDocument();
  });
});
