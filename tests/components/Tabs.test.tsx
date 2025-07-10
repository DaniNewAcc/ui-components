import AnimateMock from '../__mocks__/components/MockAnimate';

vi.mock('@/components/Animate', () => {
  return {
    default: AnimateMock,
  };
});

vi.mock('@/hooks/useComponentIds', () => ({
  default: () => ({}),
}));

import { Tabs } from '@/components';
import { __setReduceMotionForTests } from '@/hooks/useReduceMotion';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

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
      <Tabs.List testId="tabslist">
        {Array.from({ length: count }, (_, i) => (
          <Tabs.Trigger key={i} value={i + 1} disabled={disabledTabs[i]}>
            Trigger {i + 1}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {Array.from({ length: count }, (_, i) => (
        <Tabs.Content key={i} value={i + 1}>
          Content {i + 1}
        </Tabs.Content>
      ))}
    </Tabs>
  );
};

beforeEach(() => {
  __setReduceMotionForTests(true);
  vi.useFakeTimers();
});

afterEach(() => {
  __setReduceMotionForTests(undefined);
  vi.useRealTimers();
});

describe('Tabs', () => {
  describe('Context behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      (console.error as any).mockRestore();
    });
    it('should throw an error when components are not wrapped into tabs', () => {
      try {
        render(
          <>
            <Tabs.List>
              <Tabs.Trigger value={1}>Unwrapped Trigger</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value={1}>Unwrapped Content</Tabs.Content>
          </>
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Tabs components need to be wrapped into <Tabs>.');
      }
    });
  });

  describe('Rendering', () => {
    it('should render with padding', () => {
      const { getByTestId } = renderTabs(1, 1, true);
      expect(getByTestId('tabsgroup')).toHaveClass('ui:p-4');
    });

    it('should render required elements', () => {
      renderTabs(2);
      const tabs = screen.getAllByRole('tab');
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(tabs).toHaveLength(2);
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 1');
    });

    it('should match snapshot', () => {
      const { container } = renderTabs(2);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Disabled Tabs', () => {
    it('does not activate or focus a disabled tab when clicked', async () => {
      vi.useRealTimers();
      renderTabs(3, 1, false, 'horizontal', [false, true, false]);

      const user = userEvent.setup({ delay: null });
      const tabs = screen.getAllByRole('tab');

      await act(async () => {
        await user.click(tabs[0]);
      });
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[0]).toHaveFocus();

      await act(async () => {
        await user.click(tabs[1]);
      });
      expect(tabs[1]).toHaveAttribute('aria-disabled', 'true');
    });

    it('should skip disabled tabs when using keyboard navigation', async () => {
      vi.useRealTimers();
      renderTabs(3, 1, false, 'horizontal', [false, true, false]);

      const user = userEvent.setup({ delay: null });
      const tabs = screen.getAllByRole('tab');

      await act(async () => {
        tabs[0].focus();
      });

      await act(async () => {
        await user.keyboard('{ArrowRight}');
      });

      expect(tabs[2]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowLeft}');
      });

      expect(tabs[0]).toHaveFocus();
    });
  });

  describe('Interaction', () => {
    beforeEach(() => {
      renderTabs(2);
    });

    it('should switch content on tab trigger click', async () => {
      vi.useRealTimers();

      const user = userEvent.setup({ delay: null });
      const tabsTrigger = screen.getByRole('tab', { name: 'Trigger 2' });

      await act(async () => {
        await user.click(tabsTrigger);
      });

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
      expect(tabsTrigger).toHaveAttribute('aria-selected', 'true');
    });

    it('should not render non-active tab content', () => {
      renderTabs(2, 1);
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should not add focus-visible class on mousedown', () => {
      const tabsTrigger = screen.getByRole('tab', { name: 'Trigger 2' });
      expect(tabsTrigger).not.toHaveClass('focus-visible');
      fireEvent.mouseDown(tabsTrigger);
      expect(tabsTrigger).not.toHaveClass('focus-visible');
    });

    it('should focus panel after click with setTimeout', async () => {
      cleanup();
      renderTabs(1);
      const tabsTrigger = screen.getByRole('tab', { name: 'Trigger 1' });
      const panel = screen.getByRole('tabpanel');

      fireEvent.mouseDown(tabsTrigger);

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      expect(panel).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    let tabs: HTMLElement[];
    let user: ReturnType<typeof userEvent.setup>;

    const setupTabs = (count = 3, orientation: 'horizontal' | 'vertical' = 'horizontal') => {
      cleanup();
      renderTabs(count, 1, false, orientation);
      tabs = screen.getAllByRole('tab');
      user = userEvent.setup({ delay: null });
    };

    beforeEach(() => {
      setupTabs();
    });

    it('should move focus to the first tab when Home key is pressed', async () => {
      vi.useRealTimers();
      await act(async () => {
        tabs[1].focus();
      });

      await act(async () => {
        await user.keyboard('{Home}');
      });
      expect(tabs[0]).toHaveFocus();
    });

    it('should move focus to the last tab when End key is pressed', async () => {
      vi.useRealTimers();
      await act(async () => {
        tabs[0].focus();
      });

      await act(async () => {
        await user.keyboard('{End}');
      });
      expect(tabs[tabs.length - 1]).toHaveFocus();
    });

    it('should cycle focus with left and right arrow keys (horizontal)', async () => {
      vi.useRealTimers();
      await act(async () => {
        tabs[0].focus();
      });

      await act(async () => {
        await user.keyboard('{ArrowRight}');
      });

      expect(tabs[1]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowRight}');
      });
      expect(tabs[2]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowRight}');
      });
      expect(tabs[0]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowLeft}');
      });
      expect(tabs[2]).toHaveFocus();
    });

    describe('Vertical Orientation', () => {
      beforeEach(() => {
        setupTabs(3, 'vertical');
      });

      it('should have vertical orientation attribute', () => {
        expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
      });

      it('should cycle focus with up and down arrow keys (vertical)', async () => {
        vi.useRealTimers();
        await act(async () => {
          tabs[0].focus();
        });

        await act(async () => {
          await user.keyboard('{ArrowDown}');
        });
        expect(tabs[1]).toHaveFocus();

        await act(async () => {
          await user.keyboard('{ArrowDown}');
        });
        expect(tabs[2]).toHaveFocus();

        await act(async () => {
          await user.keyboard('{ArrowDown}');
        });
        expect(tabs[0]).toHaveFocus();

        await act(async () => {
          await user.keyboard('{ArrowUp}');
        });
        expect(tabs[2]).toHaveFocus();
      });
    });
  });

  describe('Focus management based on tabbing direction', () => {
    it('should move focus to the tab panel when Tab key is pressed on the active tab trigger', async () => {
      vi.useFakeTimers();
      renderTabs();

      const tabsTrigger = screen.getByRole('tab', { name: 'Trigger 1' });
      const panel = screen.getByRole('tabpanel');

      await act(async () => {
        tabsTrigger.focus();
      });

      userEvent.tab();

      await act(async () => {
        vi.advanceTimersByTime(0);
      });

      expect(panel).toHaveFocus();
    });

    it('should move focus to the previous focusable element when Shift+Tab is pressed on TabsList', async () => {
      renderTabs();

      const tabsList = screen.getByTestId('tabslist');
      tabsList.focus();

      fireEvent.keyDown(tabsList, { key: 'Tab', shiftKey: true });

      expect(tabsList).not.toHaveFocus();
    });
  });

  describe('idMap Behavior', () => {
    it('should fallback to default IDs when hook returns no IDs', () => {
      render(
        <Tabs defaultValue={1}>
          <Tabs.List>
            <Tabs.Trigger value={1}>Trigger 1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value={1}>Content 1</Tabs.Content>
        </Tabs>
      );

      const trigger = screen.getByRole('tab');
      const content = screen.getByRole('tabpanel');

      expect(trigger).toHaveAttribute('id', 'trigger-1');
      expect(content).toHaveAttribute('id', 'content-1');

      expect(trigger).toHaveAttribute('aria-controls', 'content-1');
      expect(content).toHaveAttribute('aria-labelledby', 'trigger-1');
    });
  });

  describe('Timeout Behavior', () => {
    it('should clear and reset timeout when Tab keydown happens multiple times quickly', async () => {
      renderTabs();

      const tabsList = screen.getByTestId('tabslist');
      fireEvent.keyDown(tabsList, { key: 'Tab', shiftKey: false });

      fireEvent.keyDown(tabsList, { key: 'Tab', shiftKey: true });

      await act(async () => {
        vi.advanceTimersByTime(20);
      });
    });
  });
});
