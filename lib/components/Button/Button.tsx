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
          "ui-bg-indigo-600 ui-border-transparent ui-text-white hover:ui-bg-indigo-700 hover:ui-border-indigo-900 focus:ui-ring-indigo-800 active:ui-bg-indigo-700 active:ui-border-indigo-900 active:ui-text-white",
        outlined:
          "ui-bg-white ui-border-indigo-700 ui-text-indigo-600 hover:ui-bg-indigo-600 hover:ui-border-transparent hover:ui-text-white focus:ui-bg-indigo-600 focus:ui-border-transparent focus:ui-ring-indigo-800 focus:ui-text-white active:ui-bg-indigo-700 active:ui-border-transparent active:ui-text-white",
        transparent:
          "ui-bg-transparent ui-border-transparent ui-shadow-none ui-text-indigo-600 hover:ui-border-indigo-500 focus:ui-ring-indigo-500 active:ui-border-indigo-500",
      },
      size: {
        sm: "ui-text-sm ui-py-1 ui-px-2",
        md: "ui-text-base ui-py-2 ui-px-4",
        lg: "ui-text-base ui-py-3 ui-px-6",
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
  ({ as, variant, size, rounded, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          ButtonVariants({ as, variant, size, rounded }),
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
