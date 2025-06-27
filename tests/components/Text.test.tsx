import { Text } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Text', () => {
  it('should render', () => {
    render(<Text testId="text">Content</Text>);

    const text = screen.getByTestId('text');
    expect(text.hasAttribute('as'));
    expect(text).toBeInTheDocument();
  });
  it('should render correctly as a span element', () => {
    render(
      <Text as={'span'} testId="text">
        Content
      </Text>
    );

    const text = screen.getByTestId('text');
    expect(text.tagName).toBe('SPAN');
    expect(text).toBeInTheDocument();
  });
  it('should render correctly as a h1 element', () => {
    render(
      <Text variant={'heading'} testId="text">
        Content
      </Text>
    );

    const text = screen.getByTestId('text');
    expect(text.tagName).toBe('H1');
    expect(text).toBeInTheDocument();
  });
  it('should render correctly as a heading element based on level value', () => {
    render(
      <Text variant={'heading'} testId="text" level={3}>
        Content
      </Text>
    );

    const text = screen.getByTestId('text');
    expect(text.tagName).toBe('H3');
    expect(text).toBeInTheDocument();
  });
});
