import { render, screen, fireEvent } from '@testing-library/react';
import { BaseButton } from './baseButton';

describe('BaseButton', () => {
  it('renders a button with the given text', () => {
    render(<BaseButton text="클릭하세요" />);
    const buttonElement = screen.getByRole('button', { name: /클릭하세요/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<BaseButton text="클릭" onClick={handleClick} />);
    const buttonElement = screen.getByRole('button', { name: /클릭/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
