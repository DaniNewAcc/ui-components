import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "../../lib";

describe("Separator", () => {
  it("should render", () => {
    render(<Separator />);

    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });
});
