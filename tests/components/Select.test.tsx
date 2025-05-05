import { Select, SelectDropdown, SelectOption, SelectTrigger } from '@components/Select'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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
        <Select options={options} testId="select-component">
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
        <Select options={options} testId="select-component">
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
        <Select options={options} testId="select-component">
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
        <Select options={options} testId="select-component">
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
        <Select options={options} testId="select-component">
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
        <Select options={options} defaultValue={1} testId="select-component">
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
        <Select options={options} defaultValue={1} testId="select-component">
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
        <Select options={options} testId="select-component">
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
});
