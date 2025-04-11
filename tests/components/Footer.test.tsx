import { Footer } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Footer", () => {
  it("should render", () => {
    render(
      <Footer>
        <div></div>
      </Footer>,
    );
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });
});
