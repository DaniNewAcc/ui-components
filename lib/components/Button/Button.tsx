import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: ReactNode;
}

const ButtonVariants = cva(
  [
    "ui-inline-flex",
    "ui-gap-2",
    "ui-items-center",
    "ui-justify-center",
    "ui-font-semibold",
    "ui-leading-none",
    "ui-tracking-wide",
    "ui-border",
    "ui-shadow-sm",
    "ui-whitespace-nowrap",
    "ui-transition-all",
    "ui-duration-200",
    "active:ui-shadow-none",
    "focus:ui-outline-none",
    "focus-visible:ui-ring-4",
    "disabled:ui-pointer-events-none",
    "disabled:ui-opacity-50",
    "disabled:ui-shadow-none",
  ],
  {
    variants: {
      as: {
        btn: "",
        icon: "ui-p-0",
      },
      variant: {
        default:
          "ui-bg-primary-600 ui-border-transparent ui-text-primary-50 hover:ui-bg-primary-700 hover:ui-border-primary-900 focus:ui-ring-primary-800 active:ui-bg-primary-700 active:ui-border-primary-900 active:ui-text-primary-50",
        outlined:
          "ui-bg-transparent ui-border-primary-700 ui-text-primary-600 hover:ui-bg-primary-600 hover:ui-border-transparent hover:ui-text-primary-50 focus:ui-bg-primary-600 focus:ui-border-transparent focus:ui-ring-primary-800 focus:ui-text-primary-50 active:ui-bg-primary-700 active:ui-border-transparent active:ui-text-primary-50",
        transparent:
          "ui-bg-transparent ui-border-transparent ui-shadow-none ui-text-primary-600 hover:ui-border-primary-500 focus:ui-ring-primary-500 active:ui-border-primary-500",
      },
      size: {
        sm: "ui-text-sm ui-py-1 ui-px-2",
        md: "ui-text-base ui-py-2 ui-px-4",
        lg: "ui-text-base ui-py-3 ui-px-6",
      },
      fullWidth: {
        true: "ui-w-full",
      },
      rounded: {
        default: "",
        full: "ui-rounded-full",
      },
    },
    compoundVariants: [
      {
        as: "btn",
        size: "sm",
        rounded: "default",
        class: "ui-rounded-sm",
      },
      {
        as: "btn",
        size: "md",
        rounded: "default",
        class: "ui-rounded-md",
      },
      {
        as: "btn",
        size: "lg",
        rounded: "default",
        class: "ui-rounded-lg",
      },
      {
        as: "icon",
        size: "sm",
        rounded: "default",
        class: "ui-rounded-sm ui-h-8 ui-w-8",
      },
      {
        as: "icon",
        size: "md",
        rounded: "default",
        class: "ui-rounded-md ui-h-10 ui-w-10",
      },
      {
        as: "icon",
        size: "lg",
        rounded: "default",
        class: "ui-rounded-lg ui-h-12 ui-w-12",
      },
      {
        as: "icon",
        size: "sm",
        rounded: "full",
        class: "ui-h-8 ui-w-8",
      },
      {
        as: "icon",
        size: "md",
        rounded: "full",
        class: "ui-h-10 ui-w-10",
      },
      {
        as: "icon",
        size: "lg",
        rounded: "full",
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { as, variant, size, fullWidth, rounded, className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          ButtonVariants({ as, variant, size, fullWidth, rounded }),
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default Button;
