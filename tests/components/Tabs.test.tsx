import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const renderTabs = (
  count = 3,
  defaultValue = 1,
  hasPadding = false,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  disabledTabs: boolean[] = []
) => {
  return render(
    <Tabs
      defaultValue={defaultValue}
      hasPadding={hasPadding}
      orientation={orientation}
      testId="tabsgroup"
    >
      <TabsList testId="tabslist">
        {Array.from({ length: count }, (_, i) => (
          <TabsTrigger key={i} value={i + 1} disabled={disabledTabs[i]}>
            Trigger {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {Array.from({ length: count }, (_, i) => (
        <TabsContent key={i} value={i + 1}>
          Content {i + 1}
        </TabsContent>
      ))}
    </Tabs>
  );
};

afterEach(cleanup);

describe('Tabs', () => {
  describe('Context behavior', () => {
    it('should throw an error when components are not wrapped into tabs', () => {
      expect(() =>
        render(
          <>
            <TabsList>
              <TabsTrigger value={1}>Unwrapped Trigger</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Unwrapped Content</TabsContent>
          </>
        )
      ).toThrowError('Tabs components need to be wrapped into <Tabs>.');
    });
  });

  describe('Rendering', () => {
    it('should render with padding', () => {
      const { getByTestId } = renderTabs(1, 1, true);
      expect(getByTestId('tabsgroup')).toHaveClass('ui:p-4');
    });

    it('should render required elements', () => {
      renderTabs(2);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 1');
    });

    it('should match snapshot', () => {
      const { container } = renderTabs(2);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Disabled Tabs', () => {
    it('should skip disabled tabs when using keyboard navigation', async () => {
      renderTabs(3, 1, false, 'horizontal', [false, true, false]);

      const tabs = screen.getAllByRole('tab');
      const user = userEvent.setup();

      tabs[0].focus();

      await user.keyboard('{ArrowRight}');

      expect(tabs[2]).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(tabs[0]).toHaveFocus();
    });
  });

  describe('Interaction', () => {
    beforeEach(() => {
      renderTabs(2);
    });

    it('should switch content on tab trigger click', () => {
      const tabsTrigger = screen.getByRole('tab', { name: 'Trigger 2' });

      fireEvent.click(tabsTrigger);
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
      expect(tabsTrigger).toHaveAttribute('aria-selected', 'true');
    });

    it('should not render non-active tab content', () => {
      cleanup();
      renderTabs(2, 1);
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should set focus visible styling on mousedown event', () => {
      const tabsTrigger = screen.getByRole('tab', { name: 'Trigger 2' });
      expect(tabsTrigger).not.toHaveClass('focus-visible');

      fireEvent.mouseDown(tabsTrigger);
      expect(tabsTrigger).not.toHaveClass('focus-visible');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      renderTabs();
    });

    it('should move focus to the first tab when Tab key is pressed before Home key', async () => {
      const user = userEvent.setup();
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).not.toHaveFocus();

      await user.keyboard('{Tab}');

      await user.keyboard('{Home}');

      await waitFor(() => {
        expect(tabs[0]).toHaveFocus();
      });
    });

    it('should move focus to the last tab when End key is pressed', async () => {
      const user = userEvent.setup();
      const tabs = screen.getAllByRole('tab');

      tabs[0].focus();
      await user.keyboard('{End}');
      await waitFor(() => {
        expect(tabs[tabs.length - 1]).toHaveFocus();
      });
    });

    it('should move focus to the tabpanel related to tabtrigger focused when Tab is pressed', async () => {
      const user = userEvent.setup();
      const tabs = screen.getAllByRole('tab');
      const panels = screen.getAllByRole('tabpanel');

      tabs[0].focus();

      await waitFor(() => {
        expect(tabs[0]).toHaveFocus();
      });

      await user.keyboard('{Tab}');

      panels[0].focus();

      await waitFor(() => {
        expect(panels[0]).toHaveFocus();
      });
    });

    it('should move focus with left and right arrow keys', async () => {
      const user = userEvent.setup();
      const tabs = screen.getAllByRole('tab');

      tabs[0].focus();
      await waitFor(() => expect(tabs[0]).toHaveFocus());

      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(tabs[1]).toHaveFocus());

      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(tabs[2]).toHaveFocus());

      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(tabs[0]).toHaveFocus());

      await user.keyboard('{ArrowLeft}');
      await waitFor(() => expect(tabs[2]).toHaveFocus());
    });

    it('should move focus with up and down arrow keys when vertical orientation is set', async () => {
      cleanup();
      renderTabs(3, 1, false, 'vertical');
      const tabs = screen.getAllByRole('tab');
      const user = userEvent.setup();

      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveAttribute('aria-orientation', 'vertical');

      tabs[0].focus();
      await waitFor(() => expect(tabs[0]).toHaveFocus());

      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(tabs[1]).toHaveFocus());

      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(tabs[2]).toHaveFocus());

      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(tabs[0]).toHaveFocus());

      await user.keyboard('{ArrowUp}');
      await waitFor(() => expect(tabs[2]).toHaveFocus());
    });
  });
});
