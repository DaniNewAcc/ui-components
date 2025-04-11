import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Tabs", () => {
  it("should render with padding", () => {
    render(
      <Tabs hasPadding defaultValue={"tab1"} testId="tabsgroup">
        <TabsList>
          <TabsTrigger value={"tab1"}>Trigger 1</TabsTrigger>
        </TabsList>
        <TabsContent value={"tab1"}>Content 1</TabsContent>
      </Tabs>,
    );

    const tabs = screen.getByTestId("tabsgroup");
    const tabsList = screen.getByRole("tablist");
    const tabsTrigger = screen.getByRole("tab");
    const tabsContent = screen.getByRole("tabpanel");

    expect(tabs).toBeInTheDocument();
    expect(tabs.hasAttribute("defaultValue"));
    expect(tabs.hasAttribute("hasPadding"));
    expect(tabsList).toBeInTheDocument();
    expect(tabsTrigger).toBeInTheDocument();
    expect(tabsContent).toBeInTheDocument();
  });

  it("should throw an error when components are not wrapped into tabs", () => {
    expect(() =>
      render(
        <>
          <TabsList>
            <TabsTrigger value={"tab1"}>1</TabsTrigger>
          </TabsList>
          <TabsContent value={"tab1"}>1</TabsContent>
        </>,
      ),
    ).toThrowError("Tabs components need to be wrapped into <Tabs>.");
  });

  it("should open tab content when the related trigger is clicked", () => {
    render(
      <Tabs defaultValue={"tab1"} testId="tabsgroup">
        <TabsList>
          <TabsTrigger value={"tab1"}>Trigger 1</TabsTrigger>
        </TabsList>
        <TabsContent value={"tab1"}>Content 1</TabsContent>
      </Tabs>,
    );

    const tabsTrigger = screen.getByRole("tab");
    const tabsContent = screen.getByRole("tabpanel");

    fireEvent.click(tabsTrigger);
    expect(tabsContent.nodeValue).toEqual(tabsTrigger.nodeValue);
    expect(tabsTrigger.ariaSelected).toBe("true");
    expect(tabsContent.tabIndex).toBe(-1);
  });

  it("should not open tab content when the trigger is clicked", () => {
    render(
      <Tabs defaultValue={"tab1"} testId="tabsgroup">
        <TabsList>
          <TabsTrigger value={"tab1"}>Trigger 1</TabsTrigger>
        </TabsList>
        <TabsContent value={"tab2"}>Content 2</TabsContent>
      </Tabs>,
    );

    const tabsTrigger = screen.getByRole("tab");
    const tabsContent = screen.queryByRole("tabpanel");

    fireEvent.click(tabsTrigger);
    expect(tabsContent).toBe(null);
  });
});
