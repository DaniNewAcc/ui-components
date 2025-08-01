import Breadcrumb from '@components/Breadcrumb';
import { render, screen } from '@testing-library/react';
import { Fragment } from 'react/jsx-runtime';

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

const renderBreadcrumb = (orientation: 'horizontal' | 'vertical') => {
  return render(
    <Breadcrumb orientation={orientation}>
      {items.map((item, index) => {
        return (
          <Fragment key={item}>
            <Breadcrumb.Item>
              <Breadcrumb.Link isCurrent={index === 0}>{item}</Breadcrumb.Link>
            </Breadcrumb.Item>
            {index !== items.length - 1 && <Breadcrumb.Separator />}
          </Fragment>
        );
      })}
    </Breadcrumb>
  );
};

describe('Breadcrumb', () => {
  describe('Context Behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      (console.error as any).mockRestore();
    });

    it('should throw an error when components are not wrapped into Breadcrumb', () => {
      try {
        render(
          <>
            <Breadcrumb.Item>
              <Breadcrumb.Link>Item 1</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
          </>
        );
        throw new Error('Expected error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          'Breadcrumb components needs to be wrapped in <Breadcrumb>.'
        );
      }
    });
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      renderBreadcrumb('horizontal');

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('should render correctly with vertical orientation', () => {
      renderBreadcrumb('vertical');

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });
});
