import { cn } from "@utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { ComponentPropsWithRef, forwardRef, ReactNode } from "react";

const CardVariants = cva(
  "ui:bg-primary-50 ui:flex ui:flex-col ui:gap-4 ui:relative ui:overflow-hidden ui:cursor-pointer ui:transition-all ui:ease-out ui:duration-200",
  {
    variants: {
      border: {
        default: "ui:border",
        outlined: "ui:border-2 ui:border-primary-500",
        topLeft:
          "ui:border-t-2 ui:border-t-primary-50 ui:border-l-2 ui:border-l-primary-50",
      },
      hoverEffect: {
        default: "",
        zoom: "ui:hover:scale-110",
      },
      padding: {
        sm: "ui:p-2",
        md: "ui:p-4",
        lg: "ui:p-6",
      },
      rounded: {
        sm: "ui:rounded-sm",
        md: "ui:rounded-md",
        lg: "ui:rounded-lg",
      },
      shadow: {
        sm: "ui:shadow-sm",
        md: "ui:shadow-md",
        lg: "ui:shadow-lg",
      },
    },
    defaultVariants: {
      border: "default",
      hoverEffect: "default",
      padding: "md",
      rounded: "md",
      shadow: "md",
    },
  },
);

type CardProps = ComponentPropsWithRef<"article"> &
  VariantProps<typeof CardVariants> & {
    testId?: string;
    children: ReactNode;
  };

const Card = forwardRef<React.ElementRef<"article">, CardProps>(
  (
    {
      border,
      hoverEffect,
      padding,
      rounded,
      shadow,
      testId,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <article
        ref={ref}
        data-testid={testId}
        className={cn(
          CardVariants({ border, hoverEffect, padding, rounded, shadow }),
          className,
        )}
        {...props}
      >
        {children}
      </article>
    );
  },
);

export default Card;
