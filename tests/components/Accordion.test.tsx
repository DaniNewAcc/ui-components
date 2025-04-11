import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Accordion", () => {
  it("should render", () => {
    render(
      <Accordion>
        <AccordionItem id="accordion1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const accordion = screen.getByRole("heading");
    expect(accordion).toBeInTheDocument();
  });

  it("should throw an error when components are not wrapped into accordion", () => {
    expect(() =>
      render(
        <>
          <AccordionItem id="accordion1">
            <AccordionTrigger>Trigger 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </>,
      ),
    ).toThrowError("Accordion components need to be wrapped into <Accordion>.");
  });

  it("should throw an error when components are not wrapped into AccordionItem", () => {
    expect(() =>
      render(
        <Accordion>
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </Accordion>,
      ),
    ).toThrowError(
      "AccordionItem components need to be wrapped into <AccordionItem>.",
    );
  });

  it("should open related accordion when his trigger is clicked", () => {
    render(
      <Accordion>
        <AccordionItem id="accordion1">
          <AccordionTrigger testId="trigger">Trigger 1</AccordionTrigger>
          <AccordionContent testId="content">Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const accordion = screen.getByRole("heading");
    const accordionTrigger = screen.getByTestId("trigger");
    expect(accordion).toBeInTheDocument();
    expect(accordionTrigger).toBeInTheDocument();
    fireEvent.click(accordionTrigger);
    const accordionContent = screen.getByTestId("content");
    expect(accordionTrigger.ariaExpanded).toBe("true");
    expect(accordionTrigger.id).toEqual(accordionContent.id);
  });
});
