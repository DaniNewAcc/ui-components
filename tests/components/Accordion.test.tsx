import { AnimateProps } from '@/components/Animate/Animate';
import AnimateMock from '../__mocks__/components/MockAnimate';

vi.mock('@/components/Animate', () => {
  return {
    default: AnimateMock,
  };
});

import { Accordion } from '@/components';
import { __setReduceMotionForTests } from '@/hooks/useReduceMotion';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

const renderAccordion = (
  count = 3,
  defaultValue: string | number | null = 1,
  multiple = false,
  options: { animateProps?: Partial<AnimateProps> } = {}
) => {
  const { animateProps } = options;
  return render(
    <Accordion items={count} defaultValue={defaultValue ?? undefined} multiple={multiple}>
      {Array.from({ length: count }, (_, i) => (
        <Accordion.Item key={i} value={i + 1}>
          <Accordion.Trigger>Trigger {i + 1}</Accordion.Trigger>
          <Accordion.Content animateProps={animateProps}>Content {i + 1}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
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

describe('Accordion', () => {
  describe('Context Behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      (console.error as any).mockRestore();
    });

    it('should throw an error when components are not wrapped into Accordion', () => {
      try {
        render(
          <>
            <Accordion.Item value={0}>
              <Accordion.Trigger>Trigger 1</Accordion.Trigger>
              <Accordion.Content>Content 1</Accordion.Content>
            </Accordion.Item>
          </>
        );
        throw new Error('Expected error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          'Accordion components need to be wrapped into <Accordion>.'
        );
      }
    });

    it('should throw an error when components are not wrapped into AccordionItem', () => {
      try {
        render(
          <Accordion items={1} defaultValue={0}>
            <Accordion.Item value={0}>
              <Accordion.Trigger>Trigger 1</Accordion.Trigger>
            </Accordion.Item>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion>
        );
        throw new Error('Expected error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          'AccordionItem components need to be wrapped into <AccordionItem>.'
        );
      }
    });
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      renderAccordion(1);

      expect(screen.getByTestId('accordion')).toBeInTheDocument();

      const trigger = screen.getAllByTestId('accordion-trigger');
      const content = screen.getAllByTestId('accordion-content');

      expect(trigger[0]).toBeInTheDocument();
      expect(content[0]).toBeInTheDocument();
      expect(content[0]).toBeVisible();
    });

    it('should apply custom animate duration if provided', () => {
      render(
        <Accordion items={1} defaultValue={1}>
          <Accordion.Item value={1}>
            <Accordion.Trigger>Trigger</Accordion.Trigger>
            <Accordion.Content animateProps={{ duration: 500 }}>Content</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const content = screen.getByTestId('accordion-content');
      expect(content).toHaveStyle(
        'transition: max-height 500ms ease, opacity 500ms ease, visibility 500ms ease'
      );
    });
  });

  describe('Interaction', () => {
    it('should start with no items open when defaultValue is undefined and multiple is true', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderAccordion(3, null, true);

      const trigger = screen.getAllByTestId('accordion-trigger');

      expect(screen.queryByText('Content 1')).toBeNull();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.getByText('Content 1')).toBeVisible();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.queryByText('Content 1')).toBeNull();
    });

    it('should start with no items open when defaultValue is undefined and multiple is false', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderAccordion(3, null, false);

      const trigger = screen.getAllByTestId('accordion-trigger');

      expect(screen.queryByText('Content 1')).toBeNull();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.getByText('Content 1')).toBeVisible();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.queryByText('Content 1')).toBeNull();
    });

    it('should not allow opening multiple items when multiple is false', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderAccordion(3, 1, false);

      const trigger = screen.getAllByTestId('accordion-trigger');

      expect(screen.getByText('Content 1')).toBeVisible();
      expect(screen.queryByText('Content 2')).toBeNull();

      await act(async () => {
        await user.click(trigger[1]);
      });

      expect(screen.getByText('Content 2')).toBeVisible();
      expect(screen.queryByText('Content 1')).toBeNull();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.getByText('Content 1')).toBeVisible();
      expect(screen.queryByText('Content 2')).toBeNull();
    });

    it('should allow opening multiple items when multiple is true', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderAccordion(3, 1, true);

      const trigger = screen.getAllByTestId('accordion-trigger');

      let content = screen.queryAllByTestId('accordion-content');
      expect(content[0]).toHaveTextContent('Content 1');

      await act(async () => {
        await user.click(trigger[1]);
      });

      content = screen.queryAllByTestId('accordion-content');
      expect(content[0]).toHaveTextContent('Content 1');
      expect(content[1]).toHaveTextContent('Content 2');

      await act(async () => {
        await user.click(trigger[2]);
      });

      content = screen.queryAllByTestId('accordion-content');
      expect(content[2]).toHaveTextContent('Content 3');
    });

    it('should toggle an already open item when clicked again (multiple is true)', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderAccordion(3, 1, true);

      const trigger = screen.getAllByTestId('accordion-trigger');

      let content = screen.queryAllByTestId('accordion-content');
      expect(content[0]).toHaveTextContent('Content 1');

      await act(async () => {
        await user.click(trigger[1]);
      });

      content = screen.queryAllByTestId('accordion-content');
      expect(content[0]).toHaveTextContent('Content 1');
      expect(content[1]).toHaveTextContent('Content 2');

      await act(async () => {
        await user.click(trigger[1]);
      });

      content = screen.queryAllByTestId('accordion-content');
      expect(content[0]).toHaveTextContent('Content 1');
    });

    it('should close an open item if clicked again when multiple is false', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderAccordion(3, 1, false);

      const trigger = screen.getAllByTestId('accordion-trigger');

      expect(screen.getByText('Content 1')).toBeVisible();

      await act(async () => {
        await user.click(trigger[0]);
      });

      const content = screen.queryByText('Content 1');
      expect(content).not.toBeInTheDocument();
      expect(content).toBeNull();
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(async () => {
      renderAccordion();
    });

    it('should moves focus to the first item when Home key is pressed', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      const item = screen.getAllByTestId('accordion-item');

      item[0].focus();

      await act(async () => {
        await user.keyboard('{Home}');
      });

      expect(item[0]).toHaveFocus();
    });

    it('should move focus to the last item when End key is pressed', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      const item = screen.getAllByTestId('accordion-item');

      item[0].focus();

      await act(async () => {
        await user.keyboard('{End}');
      });

      expect(item[item.length - 1]).toHaveFocus();
    });

    it('should moves focus with arrow keys', async () => {
      vi.useRealTimers();
      await act(async () => {
        renderAccordion();
      });

      const user = userEvent.setup({ delay: null });
      const items = screen.getAllByTestId('accordion-item');

      await act(async () => {
        items[0].focus();
      });

      expect(items[0]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });

      expect(items[1]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });

      expect(items[2]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });

      expect(items[0]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowUp}');
      });

      expect(items[2]).toHaveFocus();
    });

    it('should moves focus with tab and shiftTab keys', async () => {
      vi.useRealTimers();
      await act(async () => {
        renderAccordion();
      });

      const user = userEvent.setup({ delay: null });
      const item = screen.getAllByTestId('accordion-item');

      await act(async () => {
        item[0].focus();
      });

      expect(item[0]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{Tab}');
      });

      expect(item[1]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{Tab}');
      });
      expect(item[2]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{Tab}');
      });
      expect(document.activeElement).not.toBe(item[0]);

      await act(async () => {
        await user.keyboard('{Shift>}{Tab}{/Shift}');
      });

      expect(item[2]).toHaveFocus();
    });

    it('should open accordion with Enter key', async () => {
      vi.useRealTimers();
      renderAccordion();
      const user = userEvent.setup({ delay: null });
      const item = screen.getAllByTestId('accordion-item');
      await act(async () => {
        item[1].focus();
      });

      await act(async () => {
        await user.keyboard('{Enter}');
      });

      expect(screen.getAllByTestId('accordion-content')[1]).toBeVisible();
    });

    it('should open accordion with Space key', async () => {
      vi.useRealTimers();
      renderAccordion();
      const user = userEvent.setup({ delay: null });
      const item = screen.getAllByTestId('accordion-item');
      await act(async () => {
        item[1].focus();
      });

      await act(async () => {
        await user.keyboard(' ');
      });

      expect(screen.getAllByTestId('accordion-content')[1]).toBeVisible();
    });
  });
});
