import Header from '@components/Header';
import { render, screen } from '@testing-library/react';

describe('Header', () => {
  it('should render', () => {
    render(
      <Header>
        <div></div>
      </Header>
    );
    const header = screen.getByTestId('header');
    expect(header.hasChildNodes);
    expect(header).toBeInTheDocument();
  });
});
