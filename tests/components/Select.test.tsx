import AnimateMock from '../__mocks__/components/MockAnimate';

vi.mock('@/components/Animate', () => {
  return {
    default: AnimateMock,
  };
});

import { Select } from '@/components';
import { __setReduceMotionForTests } from '@/hooks/useReduceMotion';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

const options = [
  { id: 1, name: 'First Option' },
  { id: 2, name: 'Second Option' },
  { id: 3, name: 'Third Option' },
];

const renderSelect = (props: Partial<React.ComponentProps<typeof Select>> = {}) => {
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
        {options.map(option => (
          <Select.Option key={option.id} value={option.id} testId={`option-${option.id}`}>
            {option.name}
          </Select.Option>
        ))}
      </Select.Dropdown>
    </Select>
  );
};

beforeEach(() => {
  __setReduceMotionForTests(true);
  vi.useFakeTimers();
});

afterEach(() => {
  __setReduceMotionForTests(undefined);
  vi.useRealTimers();
  cleanup();
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

  describe('Interaction', () => {
    it('should open dropdown when trigger is clicked', () => {
      renderSelect();

      fireEvent.click(screen.getByTestId('select-trigger'));

      expect(screen.getByTestId('select-dropdown')).toBeInTheDocument();
    });

    it('should close the dropdown when the same option is clicked again', () => {
      renderSelect({ defaultValue: 1 });

      const trigger = screen.getByTestId('select-trigger');
      fireEvent.click(trigger);

      const option = screen.getByTestId('option-1');
      fireEvent.click(option);

      expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();
    });

    it('should reset selection when clear button is clicked', () => {
      renderSelect({ defaultValue: 1, clearable: true });

      const clearButton = screen.getByTestId('clear-btn');
      expect(clearButton).toBeInTheDocument();
      fireEvent.click(clearButton);

      expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();
      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('should focus the active option on open when activeOption is valid and enabled', async () => {
      vi.useRealTimers();
      renderSelect({ defaultValue: 1 });

      const trigger = screen.getByTestId('select-trigger');
      await act(async () => {
        fireEvent.click(trigger);
      });

      const options = await screen.findAllByRole('option');
      await waitFor(() => {
        expect(options[0]).toHaveFocus();
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
      });
    });

    it('should reset selection when clear button is focused and enter key is pressed', async () => {
      vi.useRealTimers();
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
    it('should move the focus with up and down arrow keys', async () => {
      vi.useRealTimers();
      renderSelect();

      const user = userEvent.setup();
      const trigger = screen.getByRole('combobox');

      await act(async () => {
        await user.click(trigger);
      });

      const listbox = await screen.findByRole('listbox');
      const options = screen.getAllByRole('option');
      expect(listbox).toBeInTheDocument();

      options[0].focus();
      await waitFor(() => {
        expect(document.activeElement).toBe(options[0]);
      });

      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(options[1]);
      });

      await act(async () => {
        await user.keyboard('{ArrowUp}');
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(options[0]);
      });
    });

    it('should move the focus to the first element with Home key', async () => {
      vi.useRealTimers();
      renderSelect();

      const user = userEvent.setup();
      const trigger = screen.getByRole('combobox');

      await act(async () => {
        await user.click(trigger);
      });

      const listbox = await screen.findByRole('listbox');
      const options = screen.getAllByRole('option');
      expect(listbox).toBeInTheDocument();

      options[1].focus();
      await waitFor(() => {
        expect(document.activeElement).toBe(options[1]);
      });

      await act(async () => {
        await user.keyboard('{Home}');
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(options[1]);
      });
    });

    it('should move the focus to the last element with End key', async () => {
      vi.useRealTimers();
      renderSelect();

      const user = userEvent.setup();
      const trigger = screen.getByRole('combobox');

      await act(async () => {
        await user.click(trigger);
      });

      const listbox = await screen.findByRole('listbox');
      const options = screen.getAllByRole('option');
      expect(listbox).toBeInTheDocument();

      options[1].focus();
      await waitFor(() => {
        expect(document.activeElement).toBe(options[1]);
      });

      await act(async () => {
        await user.keyboard('{End}');
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(options[2]);
      });
    });

    it('should close the dropdown when escape key is pressed', async () => {
      vi.useRealTimers();
      renderSelect();

      const user = userEvent.setup({ delay: null });
      const trigger = screen.getByRole('combobox');

      await act(async () => {
        await user.click(trigger);
      });

      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should pass to the trigger the option selected when enter key is pressed', async () => {
      vi.useRealTimers();
      renderSelect();

      const user = userEvent.setup();
      const trigger = screen.getByRole('combobox');

      await act(async () => {
        await user.click(trigger);
      });

      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      const listbox = await screen.findByRole('listbox');
      expect(listbox).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      options[0].focus();
      expect(document.activeElement).toBe(options[0]);

      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });
      expect(document.activeElement).toBe(options[1]);

      await act(async () => {
        await user.keyboard('{Enter}');
      });

      await waitFor(() => {
        expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();
      });

      expect(trigger).toHaveTextContent('Second Option');
    });

    it('should pass to the trigger the option selected when spacebar key is pressed', async () => {
      vi.useRealTimers();
      renderSelect();

      const user = userEvent.setup();
      const trigger = screen.getByRole('combobox');

      await act(async () => {
        await user.click(trigger);
      });

      const listbox = await screen.findByRole('listbox');
      const options = screen.getAllByRole('option');
      expect(listbox).toBeInTheDocument();

      options[0].focus();

      await waitFor(() => {
        expect(document.activeElement).toBe(options[0]);
      });

      await act(async () => {
        await user.keyboard('{ArrowDown}');
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(options[1]);
      });

      await act(async () => {
        await user.keyboard(' ');
      });

      expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();

      expect(trigger).toHaveTextContent('Second Option');
    });

    it('should not move the focus if tab key is pressed when the dropdown is open', async () => {
      vi.useRealTimers();
      renderSelect();

      const user = userEvent.setup({ delay: null });
      const trigger = screen.getByRole('combobox');

      await act(async () => {
        await user.click(trigger);
      });

      const option1 = screen.getByTestId('option-1');

      await act(async () => {
        await user.keyboard('{Tab}');
      });

      await waitFor(() => {
        expect(document.activeElement).toBe(option1);
      });
    });

    it('should trap focus and not move it when Tab is pressed', async () => {
      vi.useRealTimers();
      renderSelect();

      const user = userEvent.setup();
      const trigger = screen.getByRole('combobox');

      await act(async () => {
        await user.click(trigger);
      });

      expect(screen.getByRole('listbox')).toBeVisible();

      const options = screen.getAllByRole('option');
      options[0].focus();
      expect(document.activeElement).toBe(options[0]);

      await act(async () => {
        await user.keyboard('{Tab}');
      });

      expect(document.activeElement).toBe(options[0]);
    });
  });

  describe('Typeahead Behavior', () => {
    it('should focus option matching single key', async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      renderSelect();
      await act(() => user.click(screen.getByRole('combobox')));
      const opt1 = screen.getByTestId('option-1');
      opt1.focus();
      await act(() => user.keyboard('F'));
      expect(opt1).toHaveFocus();
    });
  });
});
