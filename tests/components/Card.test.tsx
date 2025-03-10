import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "../../lib";

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
