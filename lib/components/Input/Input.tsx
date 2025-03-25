import { cn } from "@/utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";

const InputVariants = cva("", {
  variants: {},
  defaultVariants: {},
});

type InputProps = ComponentPropsWithoutRef<"input"> &
  VariantProps<typeof InputVariants> & {};

const Input = forwardRef<React.ElementRef<"input">, InputProps>(
  ({ ...props }, ref) => (
    <Input ref={ref} className={cn(InputVariants({}))} {...props} />
  ),
);
export default Input;
