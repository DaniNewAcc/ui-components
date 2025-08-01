import Layout from '@components/Layout';
import { render, screen } from '@testing-library/react';

describe('Layout', () => {
  describe('Rendering', () => {
    it('should render correctly', () => {
      render(<Layout></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout.className).toMatch('ui:overflow-auto');
    });

    it('should render correctly with isCentered prop', () => {
      render(<Layout isCentered></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveClass('ui:items-center', 'ui:justify-center');
      expect(layout).not.toHaveClass('ui:items-start', 'ui:justify-start');
    });

    it('should render correctly with overflowHidden prop', () => {
      render(<Layout overflowHidden></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout.className).toMatch('ui:overflow-hidden');
      expect(layout.className).not.toMatch('ui:overflow-auto');
    });

    it('should render correctly with isCentered and overflowHidden set to false', () => {
      render(<Layout isCentered={false} overflowHidden={false} />);
      const layout = screen.getByTestId('layout');

      expect(layout).toHaveClass('ui:items-start', 'ui:justify-start');
      expect(layout).toHaveClass('ui:overflow-auto');
      expect(layout).not.toHaveClass('ui:items-center', 'ui:justify-center', 'ui:overflow-hidden');
    });
  });
});
