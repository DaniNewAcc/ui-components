import { Button } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("should render", () => {
    render(<Button>Content</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
