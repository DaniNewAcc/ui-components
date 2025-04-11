import { Flex } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Flex", () => {
  it("should render", () => {
    render(<Flex testId="flex"></Flex>);
    const flex = screen.getByTestId("flex");
    expect(flex).toBeInTheDocument();
  });
});
