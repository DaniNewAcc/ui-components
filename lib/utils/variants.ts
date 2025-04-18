import { cva } from "class-variance-authority";

export const ButtonVariants = cva(
  [
    "ui:inline-flex",
    "ui:gap-2",
    "ui:items-center",
    "ui:justify-center",
    "ui:font-semibold",
    "ui:leading-none",
    "ui:border",
    "ui:relative",
    "ui:shadow-sm",
    "ui:whitespace-nowrap",
    "ui:cursor-pointer",
    "ui:transition-all",
    "ui:duration-200",
    "ui:active:shadow-none",
    "ui:focus:outline-hidden",
    "ui:focus-visible:ring-4",
    "ui:disabled:pointer-events-none",
    "ui:disabled:opacity-50",
    "ui:disabled:shadow-none",
  ],
  {
    variants: {
      as: {
        btn: "",
        icon: "ui:p-0",
      },
      variant: {
        unstyled: "ui:border-transparent",
        default: "ui:border-transparent ui:bg-primary-600 ui:text-primary-50",
        outlined: "ui:border-primary-700 ui:bg-transparent ui:text-primary-600",
        transparent:
          "ui:border-transparent ui:bg-transparent ui:text-primary-600 ui:shadow-none",
      },
      size: {
        sm: "ui:px-2 ui:py-1 ui:text-sm",
        md: "ui:px-4 ui:py-2 ui:text-base",
        lg: "ui:px-6 ui:py-3 ui:text-base",
      },
      fullWidth: {
        true: "ui:w-full",
      },
      rounded: {
        default: "",
        sm: "ui:rounded-sm",
        md: "ui:rounded-md",
        lg: "ui:rounded-lg",
        full: "ui:rounded-full",
      },
    },
    compoundVariants: [
      {
        as: ["icon", "btn"],
        size: ["sm", "md", "lg"],
        variant: "default",
        class:
          "ui:hover:border-primary-900 ui:hover:bg-primary-700 ui:focus:ring-primary-800 ui:active:border-primary-900 ui:active:bg-primary-700 ui:active:text-primary-50",
      },
      {
        as: ["icon", "btn"],
        size: ["sm", "md", "lg"],
        variant: "outlined",
        class:
          "ui:hover:border-transparent ui:hover:bg-primary-600 ui:hover:text-primary-50 ui:focus:border-transparent ui:focus:bg-primary-600 ui:focus:text-primary-50 ui:focus:ring-primary-800 ui:active:border-transparent ui:active:bg-primary-700 ui:active:text-primary-50",
      },
      {
        as: ["icon", "btn"],
        size: ["sm", "md", "lg"],
        variant: "transparent",
        class:
          "ui:hover:border-primary-500 ui:focus:ring-primary-500 ui:active:border-primary-500",
      },
      {
        as: "icon",
        size: "sm",
        rounded: ["default", "sm", "full"],
        class: "ui:h-8 ui:w-8",
      },
      {
        as: "icon",
        size: "md",
        rounded: ["default", "md", "full"],
        class: "ui:h-10 ui:w-10",
      },
      {
        as: "icon",
        size: "lg",
        rounded: ["default", "lg", "full"],
        class: "ui:h-12 ui:w-12",
      },
    ],
    defaultVariants: {
      as: "btn",
      variant: "unstyled",
      size: "sm",
      rounded: "default",
    },
  },
);

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
