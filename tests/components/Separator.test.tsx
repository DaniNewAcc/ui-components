import { Separator } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Separator", () => {
  it("should render", () => {
    render(<Separator />);

    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });
});
