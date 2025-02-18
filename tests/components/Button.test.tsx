import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../../lib";

describe("Button", () => {
  it("should render", () => {
    render(<Button>Content</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
