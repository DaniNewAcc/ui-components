import { cva } from "class-variance-authority";

export const FlexVariants = cva("ui:flex", {
  variants: {
    align: {
      default: "",
      baseline: "ui:items-baseline",
      start: "ui:items-start",
      center: "ui:items-center",
      end: "ui:items-end",
      stretch: "ui:items-stretch",
    },
    direction: {
      default: "",
      col: "ui:flex-col",
      row: "ui:flex-row",
    },
    gap: {
      default: "",
      xs: "ui:gap-1",
      sm: "ui:gap-2",
      md: "ui:gap-4",
      lg: "ui:gap-8",
      xl: "ui:gap-12",
      xxl: "ui:gap-16",
    },
    justify: {
      default: "",
      around: "ui:justify-around",
      between: "ui:justify-between",
      evenly: "ui:justify-evenly",
      start: "ui:justify-start",
      center: "ui:justify-center",
      end: "ui:justify-end",
    },
    flexWrap: {
      default: "",
      wrap: "ui:flex-wrap",
      noWrap: "ui:flex-nowrap",
      reverse: "ui:flex-wrap-reverse",
    },
  },
  defaultVariants: {
    align: "default",
    direction: "default",
    flexWrap: "default",
    gap: "default",
    justify: "default",
  },
});
