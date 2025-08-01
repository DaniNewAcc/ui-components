import Grid from '@components/Grid';
import { render, screen } from '@testing-library/react';

describe('Grid', () => {
  it('should render', () => {
    render(<Grid></Grid>);
    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
  });

  it('should wrap content in Scrollable with default class when scrollable is true', () => {
    render(<Grid scrollable={true} />);
    const scrollable = screen.getByTestId('grid').parentElement;
    expect(scrollable?.className).toMatch('ui:max-h-[300px]');
  });

  it('should wrap content in Scrollable with custom props when ScrollableProps are provided', () => {
    render(
      <Grid
        scrollable
        scrollableProps={{ className: 'custom-scroll', 'data-testid': 'scroll-wrap' }}
      />
    );
    const scrollable = screen.getByTestId('scroll-wrap');
    expect(scrollable).toBeInTheDocument();
    expect(scrollable).toHaveClass('custom-scroll');
  });

  it('should not wrap in Scrollable when scrollable is false', () => {
    render(<Grid scrollable={false} />);
    const grid = screen.getByTestId('grid');
    expect(grid.parentElement?.className).not.toMatch('ui:max-h-[300px]|custom-scroll');
  });
});
