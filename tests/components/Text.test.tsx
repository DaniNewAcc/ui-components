import { Text } from "@/components";
import { render, screen } from "@testing-library/react";

describe("Text", () => {
  it("should render", () => {
    render(<Text testId="text">Content</Text>);

    const text = screen.getByTestId("text");
    expect(text.hasAttribute("as"));
    expect(text).toBeInTheDocument();
  });
  it("should render correctly as a span element", () => {
    render(
      <Text as={"span"} testId="text">
        Content
      </Text>,
    );

    const text = screen.getByTestId("text");
    expect(text.tagName).toBe("SPAN");
    expect(text).toBeInTheDocument();
  });
});
