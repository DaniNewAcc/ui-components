import { cn } from "@utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, ReactNode } from "react";

const ButtonVariants = cva(
  [
    "ui-inline-flex",
    "ui-gap-2",
    "ui-items-center",
    "ui-justify-center",
    "ui-font-semibold",
    "ui-leading-none",
    "ui-border",
    "ui-relative",
    "ui-shadow-sm",
    "ui-whitespace-nowrap",
    "ui-transition-all",
    "ui-duration-200",
    "active:ui-shadow-none",
    "focus:ui-outline-none",
    "focus-visible:ui-ring-4",
  ],
  {
    variants: {
      as: {
        btn: "",
        icon: "ui-p-0",
      },
      variant: {
        default: "ui-bg-primary-600 ui-border-transparent ui-text-primary-50",
        outlined: "ui-bg-transparent ui-border-primary-700 ui-text-primary-600",
        transparent:
          "ui-bg-transparent ui-border-transparent ui-shadow-none ui-text-primary-600",
      },
      size: {
        sm: "ui-text-sm ui-py-1 ui-px-2",
        md: "ui-text-base ui-py-2 ui-px-4",
        lg: "ui-text-base ui-py-3 ui-px-6",
      },
      disabled: {
        true: "ui-pointer-events-none ui-opacity-50 ui-shadow-none",
      },
      fullWidth: {
        true: "ui-w-full",
      },
      rounded: {
        default: "",
        sm: "ui-rounded-sm",
        md: "ui-rounded-md",
        lg: "ui-rounded-lg",
        full: "ui-rounded-full",
      },
    },
    compoundVariants: [
      {
        as: ["icon", "btn"],
        size: ["sm", "md", "lg"],
        variant: "default",
        class:
          "hover:ui-bg-primary-700 hover:ui-border-primary-900 focus:ui-ring-primary-800 active:ui-bg-primary-700 active:ui-border-primary-900 active:ui-text-primary-50",
      },
      {
        as: ["icon", "btn"],
        size: ["sm", "md", "lg"],
        variant: "outlined",
        class:
          "hover:ui-bg-primary-600 hover:ui-border-transparent hover:ui-text-primary-50 focus:ui-bg-primary-600 focus:ui-border-transparent focus:ui-ring-primary-800 focus:ui-text-primary-50 active:ui-bg-primary-700 active:ui-border-transparent active:ui-text-primary-50",
      },
      {
        as: ["icon", "btn"],
        size: ["sm", "md", "lg"],
        variant: "transparent",
        class:
          "hover:ui-border-primary-500 focus:ui-ring-primary-500 active:ui-border-primary-500",
      },
      {
        as: "icon",
        size: "sm",
        rounded: ["default", "sm", "full"],
        class: "ui-h-8 ui-w-8",
      },
      {
        as: "icon",
        size: "md",
        rounded: ["default", "md", "full"],
        class: "ui-h-10 ui-w-10",
      },
      {
        as: "icon",
        size: "lg",
        rounded: ["default", "lg", "full"],
        class: "ui-h-12 ui-w-12",
      },
    ],
    defaultVariants: {
      as: "btn",
      variant: "default",
      size: "md",
      rounded: "default",
    },
  },
);

type ButtonProps = Omit<ComponentProps<"button">, "disabled"> &
  VariantProps<typeof ButtonVariants> & {
    children: ReactNode;
  };

const Button = ({
  as,
  disabled,
  variant,
  size,
  fullWidth,
  rounded,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        ButtonVariants({
          as,
          disabled,
          variant,
          size,
          fullWidth,
          rounded,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
