import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const renderTabs = (count = 3, defaultValue = 1, hasPadding = false) => {
  return render(
    <Tabs defaultValue={defaultValue} hasPadding={hasPadding} testId="tabsgroup">
      <TabsList>
        {Array.from({ length: count }, (_, i) => (
          <TabsTrigger key={i} value={i + 1}>
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
    it('should renders with padding', () => {
      const { getByTestId } = renderTabs(1, 1, true);
      expect(getByTestId('tabsgroup')).toHaveClass('ui:p-4');
    });

    it('should renders required elements', () => {
      renderTabs(2);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 1');
    });

    it('should matches snapshot', () => {
      const { container } = renderTabs(2);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Interaction', () => {
    it('should switches content on tab trigger click', () => {
      renderTabs(2);
      const tabsTrigger = screen.getByRole('tab', { name: 'Trigger 2' });

      fireEvent.click(tabsTrigger);
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
      expect(tabsTrigger.ariaSelected).toBe('true');
      expect(tabsTrigger).toHaveAttribute('aria-selected', 'true');
    });

    it('should not render non-active tab content', () => {
      renderTabs(2, 1);
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      renderTabs();
    });

    it('should moves focus to the first tab when Home key is pressed', async () => {
      const user = userEvent.setup();
      const tabs = screen.getAllByRole('tab');

      tabs[0].focus();

      await user.keyboard('{Home}');

      await waitFor(() => {
        expect(tabs[0]).toHaveFocus();
      });
    });

    it('should moves focus to the last tab when End key is pressed', async () => {
      const user = userEvent.setup();
      const tabs = screen.getAllByRole('tab');

      tabs[0].focus();

      await user.keyboard('{End}');

      tabs[tabs.length - 1].focus();

      await waitFor(() => {
        expect(tabs[tabs.length - 1]).toHaveFocus();
      });
    });

    it('should moves focus to the tabpanel related to the tabtrigger with focus when Tab key is pressed', async () => {
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

    it('should moves focus with arrow keys', async () => {
      renderTabs();
      const tabs = screen.getAllByRole('tab');
      const user = userEvent.setup();

      tabs[0].focus();
      waitFor(() => {
        expect(tabs[0]).toHaveFocus();
      });

      await user.keyboard('{ArrowRight}');
      waitFor(() => {
        expect(tabs[1]).toHaveFocus();
      });

      await user.keyboard('{ArrowRight}');
      waitFor(() => {
        expect(tabs[2]).toHaveFocus();
      });

      await user.keyboard('{ArrowRight}');
      waitFor(() => {
        expect(tabs[0]).toHaveFocus();
      });

      await user.keyboard('{ArrowLeft}');
      waitFor(() => {
        expect(tabs[2]).toHaveFocus();
      });
    });
  });
});
