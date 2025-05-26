import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { mockBook } from '@/__mocks__/mocks';
import Hero from '@/components/hero';
jest.mock('lucide-react');
describe('Hero', () => {
  it('renders title and books grid', () => {
    render(<Hero books={mockBook} />);
    expect(screen.getByText(/Featured Books/i)).toBeInTheDocument();
    expect(screen.getByText(/The Great Adventure/i)).toBeInTheDocument();
  });
});
