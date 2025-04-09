import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Tabs", () => {
  it("should render", () => {
    render(
      <Tabs defaultValue={"tab1"} testId="tabsgroup">
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
    expect(tabsList.hasChildNodes);
    expect(tabsList).toBeInTheDocument();
    expect(tabsTrigger.hasChildNodes);
    expect(tabsTrigger).toBeInTheDocument();
    expect(tabsContent.hasChildNodes);
    expect(tabsContent).toBeInTheDocument();
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
});
