import Label from '@components/Label';
import { render, screen } from '@testing-library/react';

describe('Label', () => {
  it('should render', () => {
    render(<Label></Label>);
    const label = screen.getByTestId('label');
    expect(label).toBeInTheDocument();
  });
});
