import { Layout } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Layout', () => {
  describe('Rendering', () => {
    it('should render correctly', () => {
      render(<Layout testId="layout"></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout).not.toHaveAttribute('role');
      expect(layout.className).toMatch('ui:overflow-auto');
    });

    it('should render correctly with main role', () => {
      render(<Layout as="main" testId="layout"></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveAttribute('role', 'main');
    });

    it('should render correctly with isCentered prop', () => {
      render(<Layout testId="layout" isCentered></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveClass('ui:items-center', 'ui:justify-center');
      expect(layout).not.toHaveClass('ui:items-start', 'ui:justify-start');
    });

    it('should render correctly with overflowHidden prop', () => {
      render(<Layout testId="layout" overflowHidden></Layout>);
      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout.className).toMatch('ui:overflow-hidden');
      expect(layout.className).not.toMatch('ui:overflow-auto');
    });

    it('should render correctly with isCentered and overflowHidden set to false', () => {
      render(<Layout testId="layout" isCentered={false} overflowHidden={false} />);
      const layout = screen.getByTestId('layout');

      expect(layout).toHaveClass('ui:items-start', 'ui:justify-start');
      expect(layout).toHaveClass('ui:overflow-auto');
      expect(layout).not.toHaveClass('ui:items-center', 'ui:justify-center', 'ui:overflow-hidden');
    });
  });
});
