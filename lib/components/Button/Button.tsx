import { ButtonVariants } from "@/utils/variants";
import { cn } from "@utils/cn";
import { VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof ButtonVariants> & {
    children: ReactNode;
  };

const Button = forwardRef<React.ElementRef<"button">, ButtonProps>(
  (
    { as, variant, size, fullWidth, rounded, className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          ButtonVariants({
            as,
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
  },
);

export default Button;
