import { __setReduceMotionForTests } from '@/hooks/useReduceMotion';
import { Select, SelectDropdown, SelectOption, SelectTrigger } from '@components/Select'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  __setReduceMotionForTests(true);
});

afterEach(() => {
  __setReduceMotionForTests(undefined);
});

describe('Select', () => {
  const options = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' },
  ];

  describe('Context Behavior', () => {
    it('should throw an error when components are not wrapped into select', () => {
      expect(() =>
        render(
          <>
            <SelectTrigger value={1}>Trigger1</SelectTrigger>
            <SelectDropdown>
              <SelectOption value={1}>Option 1</SelectOption>
            </SelectDropdown>
          </>
        )
      ).toThrowError('Select components need to be wrapped into <Select>.');
    });
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      expect(screen.getByTestId('select-trigger')).toBeInTheDocument();
    });

    it('should display placeholder text when no option is selected', () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger placeholderText="Select an option..." testId="select-trigger">
            Toggle
          </SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('should not render dropdown if closed', () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should open dropdown when trigger is clicked', async () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      fireEvent.click(screen.getByTestId('select-trigger'));

      await waitFor(() => expect(screen.getByTestId('select-dropdown')).toBeInTheDocument());
    });

    it('should close dropdown when an option is selected', async () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      fireEvent.click(screen.getByTestId('select-trigger'));
      fireEvent.click(screen.getByTestId('option-1'));

      await waitFor(() => expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument());
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should close the dropdown when the same option is clicked again', async () => {
      render(
        <Select
          valueKey="id"
          labelKey="name"
          options={options}
          defaultValue={1}
          testId="select-component"
        >
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      fireEvent.click(screen.getByTestId('select-trigger'));
      fireEvent.click(screen.getByTestId('option-1'));
      await waitFor(() => expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument());
    });

    it('should reset selection when "Clear" is clicked', async () => {
      render(
        <Select
          valueKey="id"
          labelKey="name"
          options={options}
          defaultValue={1}
          testId="select-component"
        >
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Clear'));

      await waitFor(() => expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument());
      expect(screen.getByText('Select an option...')).toBeInTheDocument();
    });

    it('should open dropdown when trigger is clicked twice', async () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      fireEvent.click(screen.getByTestId('select-trigger'));
      await waitFor(() => expect(screen.getByTestId('select-dropdown')).toBeInTheDocument());

      fireEvent.click(screen.getByTestId('select-trigger'));
      await waitFor(() => expect(screen.queryByTestId('select-dropdown')).not.toBeInTheDocument());
    });
  });

  describe('Keyboard Navigation - Trigger', () => {
    it('should open dropdown with arrow down key and give focus to the first focusable option', () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should open dropdown with arrow up key and give focus to the first focusable option', () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      fireEvent.keyDown(trigger, { key: 'ArrowUp' });

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should open dropdown with enter key and give focus to the first focusable option', () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      fireEvent.keyDown(trigger, { key: 'Enter' });

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should open dropdown with spacebar key and give focus to the first focusable option', () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      fireEvent.keyDown(trigger, { key: ' ' });

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeVisible();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should not open dropdown with unrelated key', () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      fireEvent.keyDown(trigger, { key: 'Tab' });

      const listbox = screen.queryByRole('listbox');
      expect(listbox).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation - Dropdown', () => {
    it('should move the focus with up and down arrow keys', async () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      await userEvent.click(trigger);

      const listbox = screen.getByRole('listbox');

      fireEvent.keyDown(listbox, { key: 'ArrowDown' });
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      fireEvent.keyDown(listbox, { key: 'ArrowDown' });
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 2' })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      fireEvent.keyDown(listbox, { key: 'ArrowUp' });
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });
    });

    it('should close the dropdown when escape key is pressed', async () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );

      const trigger = screen.getByRole('combobox');
      await userEvent.click(trigger);

      const listbox = screen.getByRole('listbox');

      fireEvent.keyDown(listbox, { key: 'Escape' });
      await waitFor(() => {
        expect(listbox).not.toBeInTheDocument();
      });
    });

    it('should pass to the trigger the option selected when enter key is pressed', async () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      await userEvent.click(trigger);

      const listbox = screen.getByRole('listbox');

      fireEvent.keyDown(listbox, { key: 'ArrowDown' });
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      fireEvent.keyDown(screen.getByTestId('option-1'), { key: 'Enter', code: 'Enter' });
      expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();

      expect(trigger).toHaveTextContent('Option 1');
    });

    it('should pass to the trigger the option selected when spacebar key is pressed', async () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      await userEvent.click(trigger);

      const listbox = screen.getByRole('listbox');

      fireEvent.keyDown(listbox, { key: 'ArrowDown' });
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
          'aria-selected',
          'true'
        );
      });

      fireEvent.keyDown(screen.getByTestId('option-1'), { key: ' ', code: 'Space' });
      expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument();

      expect(trigger).toHaveTextContent('Option 1');
    });

    it('should not move the focus if tab key is pressed when the dropdown is open', async () => {
      render(
        <Select valueKey="id" labelKey="name" options={options} testId="select-component">
          <SelectTrigger testId="select-trigger">Toggle</SelectTrigger>
          <SelectDropdown testId="select-dropdown">
            {options.map(option => (
              <SelectOption key={option.id} value={option.id} testId={`option-${option.id}`}>
                {option.name}
              </SelectOption>
            ))}
          </SelectDropdown>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      await userEvent.click(trigger);

      const listbox = screen.getByRole('listbox');
      const option1 = screen.getByTestId('option-1');

      fireEvent.keyDown(listbox, { key: 'Tab' });
      await waitFor(() => {
        expect(option1).toHaveAttribute('aria-selected', 'true');
      });
    });
  });
});
