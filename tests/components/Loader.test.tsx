import { Loader } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Loader", () => {
  it("should render", () => {
    render(
      <Loader loaderType={"spinner"} testId="loader">
        Loading...
      </Loader>,
    );
    const loader = screen.getByTestId("loader");
    expect(loader.hasAttribute("loaderType"));
    expect(loader).toBeInTheDocument();
  });
});
