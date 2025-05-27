import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { mockBook } from '@/__mocks__/mocks';
import Hero from '@/components/hero';
jest.mock('lucide-react');
describe('Hero', () => {
  it('renders title and books grid', () => {
    render(<Hero books={mockBook} />);
    expect(screen.getByText(/We Love Books/i)).toBeInTheDocument();
    expect(screen.getByAltText('The Great Adventure')).toBeInTheDocument();
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByText(/Previous slide/i)).toBeInTheDocument();
    expect(screen.getByText(/Next slide/i)).toBeInTheDocument();
  });
});
