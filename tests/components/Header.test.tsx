import { Header } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Header", () => {
  it("should render", () => {
    render(
      <Header>
        <div></div>
      </Header>,
    );
    const header = screen.getByRole("banner");
    expect(header.hasChildNodes);
    expect(header).toBeInTheDocument();
  });
});
