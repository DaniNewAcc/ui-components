import { Layout } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Layout", () => {
  it("should render", () => {
    render(<Layout testId="layout"></Layout>);
    const layout = screen.getByTestId("layout");
    expect(layout).toBeInTheDocument();
  });
});
