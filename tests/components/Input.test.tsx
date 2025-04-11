import { Input } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Input", () => {
  it("should render", () => {
    render(<Input></Input>);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });
});
