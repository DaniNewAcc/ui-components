import { Flex } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Flex', () => {
  it('should render', () => {
    render(<Flex testId="flex"></Flex>);
    const flex = screen.getByTestId('flex');
    expect(flex).toBeInTheDocument();
  });

  it('should wrap content in Scrollable with default class when scrollable is true', () => {
    render(<Flex testId="flex" scrollable={true} />);
    const flex = screen.getByTestId('flex');
    const wrapper = flex.parentElement;
    expect(wrapper?.className).toMatch('ui:max-h-[300px]');
  });

  it('should wrap content in Scrollable with custom class when scrollable is object', () => {
    render(
      <Flex
        testId="flex"
        scrollable={{ className: 'custom-scroll', 'data-testid': 'scrollable-wrap' }}
      />
    );
    const scrollable = screen.getByTestId('scrollable-wrap');
    expect(scrollable).toBeInTheDocument();
    expect(scrollable).toHaveClass('custom-scroll');
  });

  it('should render without Scrollable wrapper when scrollable is false', () => {
    render(<Flex testId="flex" scrollable={false} />);
    const flex = screen.getByTestId('flex');
    const wrapper = flex.parentElement;
    expect(wrapper?.className).not.toMatch('ui:max-h-[300px]|custom-scroll');
  });
});
