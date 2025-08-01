import Button from '@components/Button';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Button', () => {
  it('should render', () => {
    render(<Button>Content</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render loader correctly while attending the completion of the action', () => {
    render(
      <Button type="submit" loading showLoader>
        Content
      </Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button.hasAttribute('submit'));
    expect(button.hasAttribute('loading'));
  });

  it('should render leading icon correctly', () => {
    render(<Button leadingIcon>Content</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render trailing icon correctly', () => {
    render(<Button trailingIcon>Content</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
