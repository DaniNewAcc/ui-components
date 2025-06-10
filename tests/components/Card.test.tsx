import { Card } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Card', () => {
  it('should render', () => {
    render(
      <Card testId="card">
        <h3>title</h3>
        <p>paragraph</p>
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
  });
});

it('should apply focusable styles when focusable is true', () => {
  render(
    <Card focusable testId="card">
      <p>Focusable</p>
    </Card>
  );

  const card = screen.getByTestId('card');
  expect(card.className).toMatch('ui:focus:outline-none');
  expect(card.className).toMatch('ui:focus-visible:ring-2');
  expect(card.className).toMatch('ui:focus-visible:ring-primary-500');
});

it('should not apply focusable styles when focusable is false', () => {
  render(
    <Card focusable={false} testId="card">
      <p>Not focusable</p>
    </Card>
  );

  const card = screen.getByTestId('card');
  expect(card.className).not.toMatch('ui:focus:outline-none');
  expect(card.className).not.toMatch('ui:focus-visible:ring-2');
  expect(card.className).not.toMatch('ui:focus-visible:ring-primary-500');
});
