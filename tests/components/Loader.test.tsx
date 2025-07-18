import { Loader } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Loader', () => {
  it('should render spinner loader', () => {
    render(<Loader loaderType={'spinner'}>Loading...</Loader>);
    const loader = screen.getByTestId('loader');
    expect(loader.hasAttribute('spinner'));
    expect(loader).toBeInTheDocument();
  });

  it('should render dots loader', () => {
    render(<Loader loaderType={'dots'}>Loading...</Loader>);
    const loader = screen.getByTestId('loader');
    expect(loader.hasAttribute('dots'));
    expect(loader).toBeInTheDocument();
  });
});
