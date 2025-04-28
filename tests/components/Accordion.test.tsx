import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const renderAccordion = (count = 3, defaultValue = 1, multiple = false) => {
  return render(
    <Accordion
      items={count}
      defaultValue={defaultValue}
      multiple={multiple}
      testId="accordiongroup"
    >
      {Array.from({ length: count }, (_, i) => (
        <AccordionItem key={i} value={i + 1} testId="accordionItem">
          <AccordionTrigger testId="trigger">Trigger {i + 1}</AccordionTrigger>
          <AccordionContent testId="content">Content {i + 1}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

describe('Accordion', () => {
  describe('Context Behavior', () => {
    it('should throw an error when components are not wrapped into accordion', () => {
      expect(() =>
        render(
          <>
            <AccordionItem value={0}>
              <AccordionTrigger>Trigger 1</AccordionTrigger>
              <AccordionContent>Content 1</AccordionContent>
            </AccordionItem>
          </>
        )
      ).toThrowError('Accordion components need to be wrapped into <Accordion>.');
    });

    it('should throw an error when components are not wrapped into AccordionItem', () => {
      expect(() =>
        render(
          <Accordion items={1} defaultValue={0}>
            <AccordionItem value={0}>
              <AccordionTrigger>Trigger 1</AccordionTrigger>
            </AccordionItem>
            <AccordionContent>Content 1</AccordionContent>
          </Accordion>
        )
      ).toThrowError('AccordionItem components need to be wrapped into <AccordionItem>.');
    });
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      const { getByTestId } = renderAccordion(1);
      expect(getByTestId('accordiongroup')).toBeInTheDocument();
      const trigger = screen.getAllByTestId('trigger');
      const content = screen.getAllByTestId('content');

      expect(trigger[0]).toBeInTheDocument();
      expect(content[0]).toBeInTheDocument();

      expect(content[0]).toBeVisible();
    });
    it('should render correctly with no items', () => {
      renderAccordion(0);
      const content = screen.queryAllByTestId('content');
      expect(content.length).toBe(0);
    });
  });

  describe('Interaction', () => {
    it('should not allow opening multiple items when multiple is false', () => {
      renderAccordion(3, 1, false);
      const trigger = screen.getAllByTestId('trigger');

      let content = screen.queryAllByTestId('content');
      expect(content.length).toBe(1);
      expect(content[0]).toHaveTextContent('Content 1');

      fireEvent.click(trigger[1]);
      content = screen.queryAllByTestId('content');
      expect(content.length).toBe(1);
      expect(content[0]).toHaveTextContent('Content 2');

      fireEvent.click(trigger[0]);
      content = screen.queryAllByTestId('content');
      expect(content.length).toBe(1);
      expect(content[0]).toHaveTextContent('Content 1');
    });

    it('should allow opening multiple items when multiple is true', () => {
      renderAccordion(3, 1, true);
      const trigger = screen.getAllByTestId('trigger');

      let content = screen.queryAllByTestId('content');
      expect(content.length).toBe(1);
      expect(content[0]).toHaveTextContent('Content 1');

      fireEvent.click(trigger[1]);
      content = screen.queryAllByTestId('content');
      expect(content.length).toBe(2);
      expect(content[0]).toHaveTextContent('Content 1');
      expect(content[1]).toHaveTextContent('Content 2');

      fireEvent.click(trigger[2]);
      content = screen.queryAllByTestId('content');
      expect(content.length).toBe(3);
      expect(content[2]).toHaveTextContent('Content 3');
    });

    it('should toggle an already open item when clicked again (multiple is true)', () => {
      renderAccordion(3, 1, true);
      const trigger = screen.getAllByTestId('trigger');

      let content = screen.queryAllByTestId('content');
      expect(content.length).toBe(1);
      expect(content[0]).toHaveTextContent('Content 1');

      fireEvent.click(trigger[1]);
      content = screen.queryAllByTestId('content');
      expect(content.length).toBe(2);
      expect(content[0]).toHaveTextContent('Content 1');
      expect(content[1]).toHaveTextContent('Content 2');

      // Toggle the second item off
      fireEvent.click(trigger[1]);
      content = screen.queryAllByTestId('content');
      expect(content.length).toBe(1);
      expect(content[0]).toHaveTextContent('Content 1');
    });

    it('should close an open item if clicked again when multiple is false', () => {
      renderAccordion(3, 1, false);
      const trigger = screen.getAllByTestId('trigger');

      let content = screen.queryAllByTestId('content');
      expect(content.length).toBe(1);
      expect(content[0]).toHaveTextContent('Content 1');

      fireEvent.click(trigger[0]);
      content = screen.queryAllByTestId('content');
      expect(content.length).toBe(0); // Should be closed.

      fireEvent.click(trigger[1]);
      content = screen.queryAllByTestId('content');
      expect(content.length).toBe(1);
      expect(content[0]).toHaveTextContent('Content 2');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      renderAccordion();
    });

    it('should moves focus to the first item when Home key is pressed', async () => {
      const user = userEvent.setup();
      const item = screen.getAllByTestId('accordionItem');

      item[0].focus();

      await user.keyboard('{Home}');

      await waitFor(() => {
        expect(item[0]).toHaveFocus();
      });
    });

    it('should moves focus to the last item when End key is pressed', async () => {
      const user = userEvent.setup();
      const item = screen.getAllByTestId('accordionItem');

      item[0].focus();

      await user.keyboard('{End}');

      item[item.length - 1].focus();

      await waitFor(() => {
        expect(item[item.length - 1]).toHaveFocus();
      });
    });

    it('should moves focus with arrow keys', async () => {
      renderAccordion();
      const item = screen.getAllByTestId('accordionItem');
      const user = userEvent.setup();

      item[0].focus();
      waitFor(() => {
        expect(item[0]).toHaveFocus();
      });

      await user.keyboard('{ArrowDown}');
      waitFor(() => {
        expect(item[1]).toHaveFocus();
      });

      await user.keyboard('{ArrowDown}');
      waitFor(() => {
        expect(item[2]).toHaveFocus();
      });

      await user.keyboard('{ArrowDown}');
      waitFor(() => {
        expect(item[0]).toHaveFocus();
      });

      await user.keyboard('{ArrowUp}');
      waitFor(() => {
        expect(item[2]).toHaveFocus();
      });
    });

    it('should moves focus with tab and shiftTab keys', async () => {
      renderAccordion();
      const item = screen.getAllByTestId('accordionItem');
      const user = userEvent.setup();

      item[0].focus();
      waitFor(() => {
        expect(item[0]).toHaveFocus();
      });

      await user.keyboard('{Tab}');
      waitFor(() => {
        expect(item[1]).toHaveFocus();
      });

      await user.keyboard('{Tab}');
      waitFor(() => {
        expect(item[2]).toHaveFocus();
      });

      await user.keyboard('{Tab}');
      waitFor(() => {
        expect(item[0]).toHaveFocus();
      });

      await user.keyboard('{Shift>}{Tab}{/Shift}');
      waitFor(() => {
        expect(item[2]).toHaveFocus();
      });
    });

    it('should open accordion content when Enter or Spacebar key is pressed', async () => {
      renderAccordion();
      const item = screen.getAllByTestId('accordionItem');
      const content = screen.queryAllByTestId('content');

      item[1].focus();

      await userEvent.keyboard('{Enter}');
      expect(content[1]).toBeVisible();
    });
  });
});
