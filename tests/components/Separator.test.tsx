import { Separator } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Separator", () => {
  it("should render", () => {
    render(<Separator />);

    const separator = screen.getByRole("separator");
    expect(separator.hasAttribute("as"));
    expect(separator).toBeInTheDocument();
  });
  it("should render based on as prop", () => {
    render(<Separator as="div" />);

    const separator = screen.getByRole("separator");
    expect(separator.tagName).toBe("DIV");
    expect(separator).toBeInTheDocument();
  });
});
