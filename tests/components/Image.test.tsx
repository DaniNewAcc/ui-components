import { Image } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Image", () => {
  it("should render", () => {
    render(<Image></Image>);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
  });
});
