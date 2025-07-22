import Portal from '@/components/Portal';
import * as usePortalModule from '@/hooks/usePortal';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

describe('Portal', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-portal-container';
    document.body.appendChild(container);

    vi.spyOn(usePortalModule, 'default').mockReturnValue(container);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('should render correctly', () => {
    render(
      <Portal containerId="test-portal-container">
        <div data-testid="content">Portal</div>
      </Portal>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('portal')).toBeInTheDocument();
  });

  it('should return null if there is no container', () => {
    vi.spyOn(usePortalModule, 'default').mockReturnValue(null);

    const { container } = render(
      <Portal containerId="nonexistent">
        <div>Portal</div>
      </Portal>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should apply ARIA attributes correctly', () => {
    render(
      <Portal role="dialog" ariaLabelledby="title" ariaDescribedby="desc">
        <div>Content</div>
      </Portal>
    );

    const portalDiv = screen.getByTestId('portal');
    expect(portalDiv).toHaveAttribute('role', 'dialog');
    expect(portalDiv).toHaveAttribute('aria-labelledby', 'title');
    expect(portalDiv).toHaveAttribute('aria-describedby', 'desc');
  });

  it('should apply visibility classes based on isOpen prop', () => {
    const visibleClass = 'visible-class';
    const hiddenClass = 'hidden-class';

    const { rerender } = render(
      <Portal
        isOpen={true}
        visibleClassName={visibleClass}
        hiddenClassName={hiddenClass}
        className="base-class"
      >
        <div>Content</div>
      </Portal>
    );

    const portalDiv = screen.getByTestId('portal');
    expect(portalDiv).toHaveClass('base-class');
    expect(portalDiv).toHaveClass(visibleClass);
    expect(portalDiv).not.toHaveClass(hiddenClass);

    rerender(
      <Portal
        isOpen={false}
        visibleClassName={visibleClass}
        hiddenClassName={hiddenClass}
        className="base-class"
      >
        <div>Content</div>
      </Portal>
    );

    expect(portalDiv).toHaveClass('base-class');
    expect(portalDiv).toHaveClass(hiddenClass);
    expect(portalDiv).not.toHaveClass(visibleClass);
  });
});
