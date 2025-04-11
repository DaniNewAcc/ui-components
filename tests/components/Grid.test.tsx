import { Grid } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Grid", () => {
  it("should render", () => {
    render(<Grid testId="grid"></Grid>);
    const grid = screen.getByTestId("grid");
    expect(grid).toBeInTheDocument();
  });
});
