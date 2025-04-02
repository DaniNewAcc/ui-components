import { Card } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Card", () => {
  it("should render", () => {
    render(
      <Card testId="card">
        <h3>title</h3>
        <p>paragraph</p>
      </Card>,
    );

    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
  });
});
