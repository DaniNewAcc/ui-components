import AnimateMock from '../__mocks__/components/MockAnimate';

vi.mock('@components/Animate', () => {
  return {
    default: AnimateMock,
  };
});

import Select from '@components/Select';
import { __setReduceMotionForTests } from '@hooks/useReduceMotion';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

const options = [
  { id: 1, name: 'First Option' },
  { id: 2, name: 'Second Option' },
  { id: 3, name: 'Third Option' },
];

const renderSelect = (
  props: Partial<React.ComponentProps<typeof Select>> = {},
  disabledOptions: boolean[] = []
) => {
  const { defaultValue = null, ...restProps } = props;

  return render(
    <Select
      valueKey="id"
      labelKey="name"
      options={options}
      defaultValue={defaultValue ?? undefined}
      {...restProps}
    >
      <Select.Trigger placeholderText="Select an option...">Toggle</Select.Trigger>
      <Select.Dropdown>
        {options.map((option, i) => (
          <Select.Option
            key={option.id}
            value={option.id}
            testId={`option-${option.id}`}
            disabled={disabledOptions[i]}
          >
            {option.name}
          </Select.Option>
        ))}
      </Select.Dropdown>
    </Select>
  );
};

beforeEach(() => {
  vi.useRealTimers();

  __setReduceMotionForTests(true);
});

afterEach(() => {
  __setReduceMotionForTests(undefined);

  cleanup();
  vi.resetAllMocks();
  vi.clearAllTimers();
});

describe('Select', () => {
  describe('Context Behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      (console.error as any).mockRestore();
    });
    it('should throw an error when components are not wrapped into select', () => {
      try {
        render(
          <>
            <Select.Trigger value={1}>Trigger 1</Select.Trigger>
            <Select.Dropdown>
              <Select.Option value={1}>First Option</Select.Option>
            </Select.Dropdown>
          </>
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          'Select components need to be wrapped into <Select>.'
        );
      }
    });
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      renderSelect();

      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    it('should display placeholder text when no option is selected', () => {
      renderSelect();

      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('should not render dropdown if closed', () => {
      renderSelect();

      expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();
    });

    it('should use provided animateProps duration in SelectDropdown', () => {
      render(
        <Select options={[{ id: 1, name: 'First Option' }]} valueKey="id" labelKey="name">
          <Select.Trigger>Trigger</Select.Trigger>
          <Select.Dropdown animateProps={{ duration: 500 }}>
            <Select.Option value={1}>First Option</Select.Option>
          </Select.Dropdown>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      fireEvent.click(trigger);

      const dropdown = screen.getByTestId('select-dropdown');
      expect(dropdown).toHaveStyle(
        'transition: max-height 500ms ease, opacity 500ms ease, visibility 500ms ease'
      );
    });
  });

  describe('Disabled options', () => {
    it('should not call handleOptions when option is disabled', async () => {
      const user = userEvent.setup({ delay: null });
      renderSelect({}, [true, false, false]);

      fireEvent.click(screen.getByTestId('select-trigger'));

      const options = screen.getAllByRole('option');

      await act(async () => {
        await user.click(options[0]);
      });

      expect(screen.getByTestId('select-trigger')).toHaveTextContent('Select an option...');
    });

    it('should skip disabled options when using keyboard navigation', async () => {
      renderSelect({}, [false, true, false]);

      const user = userEvent.setup({ delay: null });

      fireEvent.click(screen.getByTestId('select-trigger'));
      const options = screen.getAllByRole('option');

      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });

      expect(options[2]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowUp}');
      });

      expect(options[0]).toHaveFocus();
    });
  });

  describe('Interaction', () => {
    it('should open dropdown when trigger is clicked', async () => {
      renderSelect();
      await act(async () => {
        await userEvent.click(screen.getByTestId('select-trigger'));
      });

      expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
    });

    it('should close dropdown when clicking outside', async () => {
      renderSelect();

      await act(async () => {
        await userEvent.click(screen.getByTestId('select-trigger'));
      });
      expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();

      await act(async () => {
        await userEvent.click(document.body);
      });

      expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();
    });

    it('should close the dropdown when the same option is clicked again', async () => {
      renderSelect({ defaultValue: 1 });
      await act(async () => {
        await userEvent.click(screen.getByTestId('select-trigger'));
      });

      const option = screen.getByTestId('option-1');
      await act(async () => {
        await userEvent.click(option);
      });

      expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();
    });

    it('should reset selection when clear button is clicked', async () => {
      renderSelect({ defaultValue: 1, clearable: true });

      const clearButton = screen.getByTestId('clear-btn');
      expect(clearButton).toBeInTheDocument();
      await act(async () => {
        await userEvent.click(clearButton);
      });

      expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();
      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('should focus the active option on open when activeOption is valid and enabled', async () => {
      renderSelect({ defaultValue: 1 });
      const trigger = screen.getByTestId('select-trigger');
      await act(async () => {
        await userEvent.click(trigger);
      });

      const options = await screen.findAllByRole('option');
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-activedescendant', options[0].id);
      });
    });
  });

  describe('Keyboard Navigation - Trigger', () => {
    ['ArrowDown', 'ArrowUp', 'Enter', ' '].forEach(key => {
      it(`should open dropdown and give focus to the first focusable option on '${key}' key press`, () => {
        renderSelect();

        const trigger = screen.getByRole('combobox');
        trigger.focus();

        fireEvent.keyDown(trigger, { key });
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeVisible();
        expect(screen.getByText('First Option')).toBeInTheDocument();
        expect(screen.getByTestId('option-1')).toHaveFocus();
      });
    });

    it('should reset selection when clear button is focused and enter key is pressed', async () => {
      renderSelect({ defaultValue: 1, clearable: true });

      expect(screen.getByText('First Option')).toBeInTheDocument();

      const clearButton = screen.getByTestId('clear-btn');
      clearButton.focus();

      await act(async () => {
        await userEvent.keyboard('{Enter}');
      });

      await waitFor(() => {
        expect(screen.getByText('Select an option...')).toBeInTheDocument();
      });
    });

    it('should reset selection when clear button is focused and Spacebar key is pressed', async () => {
      renderSelect({ defaultValue: 1, clearable: true });

      expect(screen.getByText('First Option')).toBeInTheDocument();

      const clearButton = screen.getByTestId('clear-btn');
      clearButton.focus();

      await act(async () => {
        await userEvent.keyboard('{ }');
      });

      await waitFor(() => {
        expect(screen.getByText('Select an option...')).toBeInTheDocument();
      });
    });

    it('should ignore keydown events on the clear button', () => {
      renderSelect({ clearable: true, defaultValue: 1 });

      const clearButton = screen.getByLabelText('Clear');
      clearButton.focus();

      expect(clearButton).toHaveFocus();

      const keys = ['ArrowDown', 'ArrowUp', ' ', 'Enter'];

      keys.forEach(key => {
        fireEvent.keyDown(clearButton, { key });
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('should not open dropdown with unrelated key', () => {
      renderSelect();

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      fireEvent.keyDown(trigger, { key: 'Tab' });

      const listbox = screen.queryByRole('listbox');
      expect(listbox).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation - Dropdown', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
    });

    async function openDropdown() {
      const trigger = screen.getByRole('combobox');
      await act(async () => {
        await user.click(trigger);
      });
      const listbox = await screen.findByRole('listbox');
      await waitFor(() => expect(listbox).toBeVisible());
      await waitFor(() => {
        const options = screen.queryAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
      });
      return trigger;
    }

    it('should move focus with ArrowDown and ArrowUp keys', async () => {
      renderSelect();

      const trigger = await openDropdown();
      const options = screen.getAllByRole('option');
      await waitFor(async () => {
        expect(trigger).toHaveAttribute('aria-activedescendant', options[0].id);
      });
      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });
      expect(options[1]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{ArrowUp}');
      });
      expect(options[0]).toHaveFocus();
    });

    it('should move focus to first option with Home key', async () => {
      renderSelect();
      const trigger = await openDropdown();
      const options = screen.getAllByRole('option');
      await waitFor(async () => {
        expect(trigger).toHaveAttribute('aria-activedescendant', options[0].id);
      });
      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });
      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });
      expect(options[2]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{Home}');
      });
      expect(options[0]).toHaveFocus();
    });

    it('should move focus to last option with End key', async () => {
      renderSelect();
      const trigger = await openDropdown();
      const options = screen.getAllByRole('option');
      await waitFor(async () => {
        expect(trigger).toHaveAttribute('aria-activedescendant', options[0].id);
      });
      await act(async () => {
        await user.keyboard('{End}');
      });
      expect(options[2]).toHaveFocus();
    });

    it('should close dropdown when Escape is pressed', async () => {
      renderSelect();
      const trigger = await openDropdown();
      await act(async () => {
        await user.keyboard('{Escape}');
      });
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
      expect(trigger).toHaveFocus();
    });

    it('should select an option with Enter key', async () => {
      renderSelect();
      const trigger = await openDropdown();
      const options = screen.getAllByRole('option');
      await waitFor(async () => {
        expect(trigger).toHaveAttribute('aria-activedescendant', options[0].id);
      });

      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-activedescendant', options[1].id);
      });
      await act(async () => {
        await user.keyboard('{Enter}');
      });
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
      expect(trigger).toHaveTextContent('Second Option');
    });

    it('should select an option with Spacebar key', async () => {
      renderSelect();
      const trigger = await openDropdown();
      const options = screen.getAllByRole('option');
      await waitFor(async () => {
        expect(trigger).toHaveAttribute('aria-activedescendant', options[0].id);
      });
      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-activedescendant', options[1].id);
      });

      await act(async () => {
        await user.keyboard('[Space]');
      });
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
      expect(trigger).toHaveTextContent('Second Option');
    });

    it('should not close or move focus with Tab key (trap focus)', async () => {
      renderSelect();
      await openDropdown();
      const options = screen.getAllByRole('option');
      options[1].focus();
      expect(options[1]).toHaveFocus();

      await act(async () => {
        await user.keyboard('{Tab}');
      });
      expect(options[1]).toHaveFocus();
    });
  });

  describe('Typeahead Behavior', () => {
    it('should focus option matching single key', async () => {
      const user = userEvent.setup({ delay: 5 });
      renderSelect();
      await act(() => user.click(screen.getByRole('combobox')));
      const opt1 = screen.getByTestId('option-1');
      opt1.focus();
      await act(() => user.keyboard('F'));
      expect(opt1).toHaveFocus();
    });
  });
});
