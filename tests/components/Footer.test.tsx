import Footer from '@components/Footer';
import { render, screen } from '@testing-library/react';

describe('Footer', () => {
  it('should render', () => {
    render(
      <Footer>
        <div></div>
      </Footer>
    );
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
});
