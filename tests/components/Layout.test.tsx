import { Layout } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Layout', () => {
  describe('Rendering', () => {
    it('should render correctly', () => {
      render(<Layout testId="layout"></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout).not.toHaveAttribute('role');
    });

    it('should render correctly with main role', () => {
      render(<Layout as="main" testId="layout"></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveAttribute('role', 'main');
    });
  });
});
