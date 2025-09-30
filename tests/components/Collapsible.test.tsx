import Collapsible from '@components/Collapsible';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe } from 'vitest';

const renderCollapsible = (
  count = 3,
  defaultValue: string | number | null = 1,
  multiple = false
) => {
  return render(
    <Collapsible defaultValue={defaultValue ?? undefined} multiple={multiple}>
      {Array.from({ length: count }, (_, i) => (
        <Collapsible.Item key={i} value={i + 1}>
          <Collapsible.Trigger>
            <button>Trigger {i + 1}</button>
          </Collapsible.Trigger>
          <Collapsible.Content>Content {i + 1}</Collapsible.Content>
        </Collapsible.Item>
      ))}
    </Collapsible>
  );
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Collapsible', () => {
  describe('Context Behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      (console.error as any).mockRestore();
    });

    it('should throw an error when components are not wrapped into Collapsible', () => {
      try {
        render(
          <>
            <Collapsible.Item value={0}>
              <Collapsible.Trigger>
                <button>Trigger 1</button>
              </Collapsible.Trigger>
              <Collapsible.Content>Content 1</Collapsible.Content>
            </Collapsible.Item>
          </>
        );
        throw new Error('Expected error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          'Collapsible components must be wrapped in <Collapsible>.'
        );
      }
    });

    it('should throw an error when components are not wrapped into CollapsibleItem', () => {
      try {
        render(
          <Collapsible defaultValue={0}>
            <Collapsible.Item value={0}>
              <Collapsible.Trigger>
                <button>Trigger 1</button>
              </Collapsible.Trigger>
            </Collapsible.Item>
            <Collapsible.Content>Content 1</Collapsible.Content>
          </Collapsible>
        );
        throw new Error('Expected error was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          'CollapsibleItem components must be wrapped in <CollapsibleItem>.'
        );
      }
    });
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      renderCollapsible(3);

      expect(screen.getByTestId('collapsible')).toBeInTheDocument();

      const trigger = screen.getAllByTestId('collapsible-trigger');
      const content = screen.getAllByTestId('collapsible-content');

      expect(trigger[0]).toBeInTheDocument();
      expect(content[0]).toBeInTheDocument();
      expect(content[0]).toBeVisible();
    });

    it('should activate multiple items when defaultValue is an array', () => {
      render(
        <Collapsible defaultValue={['Item 1', 'Item 2']} multiple>
          <Collapsible.Item value={'Item 1'}>
            <Collapsible.Trigger>
              <button>Trigger 1</button>
            </Collapsible.Trigger>
            <Collapsible.Content>Content 1</Collapsible.Content>
          </Collapsible.Item>
          <Collapsible.Item value={'Item 2'}>
            <Collapsible.Trigger>
              <button>Trigger 2</button>
            </Collapsible.Trigger>
            <Collapsible.Content>Content 2</Collapsible.Content>
          </Collapsible.Item>
        </Collapsible>
      );

      expect(screen.getByText('Content 1')).toBeVisible();
      expect(screen.getByText('Content 2')).toBeVisible();
    });
  });

  describe('Interaction', () => {
    it('should start with no items open when defaultValue is undefined and multiple is true', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderCollapsible(3, null, true);

      const trigger = screen.getAllByTestId('collapsible-trigger');

      expect(screen.queryByText('Content 1')).not.toBeVisible();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.getByText('Content 1')).toBeVisible();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.queryByText('Content 1')).not.toBeVisible();
    });

    it('should start with no items open when defaultValue is undefined and multiple is false', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderCollapsible(3, null, false);

      const trigger = screen.getAllByTestId('collapsible-trigger');

      expect(screen.queryByText('Content 1')).not.toBeVisible();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.getByText('Content 1')).toBeVisible();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.queryByText('Content 1')).not.toBeVisible();
    });

    it('should not allow opening multiple items when multiple is false', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderCollapsible(3, 1, false);

      const trigger = screen.getAllByTestId('collapsible-trigger');

      expect(screen.getByText('Content 1')).toBeVisible();
      expect(screen.queryByText('Content 2')).not.toBeVisible();

      await act(async () => {
        await user.click(trigger[1]);
      });

      expect(screen.getByText('Content 2')).toBeVisible();
      expect(screen.queryByText('Content 1')).not.toBeVisible();

      await act(async () => {
        await user.click(trigger[0]);
      });

      expect(screen.getByText('Content 1')).toBeVisible();
      expect(screen.queryByText('Content 2')).not.toBeVisible();
    });

    it('should allow opening multiple items when multiple is true', async () => {
      vi.useRealTimers();
      const user = userEvent.setup({ delay: null });
      renderCollapsible(3, 1, true);

      const trigger = screen.getAllByTestId('collapsible-trigger');

      let content = screen.queryAllByTestId('collapsible-content');
      expect(content[0]).toHaveTextContent('Content 1');

      await act(async () => {
        await user.click(trigger[1]);
      });

      content = screen.queryAllByTestId('collapsible-content');
      expect(content[0]).toHaveTextContent('Content 1');
      expect(content[1]).toHaveTextContent('Content 2');

      await act(async () => {
        await user.click(trigger[2]);
      });

      content = screen.queryAllByTestId('collapsible-content');
      expect(content[2]).toHaveTextContent('Content 3');
    });

    it('should call onValueChange correctly', () => {
      const handleValueChange = vi.fn();

      render(
        <Collapsible value={null} onValueChange={handleValueChange}>
          <Collapsible.Item value={1}>
            <Collapsible.Trigger>
              <button>Trigger 1</button>
            </Collapsible.Trigger>
            <Collapsible.Content>Content 1</Collapsible.Content>
          </Collapsible.Item>
        </Collapsible>
      );

      const button = screen.getByText('Trigger 1');
      fireEvent.click(button);

      expect(handleValueChange).toHaveBeenCalledWith(1);
    });
  });

  describe('Disabled behavior', () => {
    it('should not expand content when disabled', () => {
      render(
        <Collapsible>
          <Collapsible.Item value={1} disabled>
            <Collapsible.Trigger>
              <button>Trigger 1</button>
            </Collapsible.Trigger>
            <Collapsible.Content>Content 1</Collapsible.Content>
          </Collapsible.Item>
        </Collapsible>
      );

      const button = screen.getByText('Trigger 1');

      fireEvent.click(button);
      expect(screen.getByText('Content 1')).not.toBeVisible();
    });
  });
});
