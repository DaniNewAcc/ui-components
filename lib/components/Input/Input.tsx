import { cn } from "@/utils/cn";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

const Input = forwardRef<React.ElementRef<"input">, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "ui:flex ui:h-8 ui:w-full ui:rounded-md ui:border ui:border-primary-600 ui:px-4 ui:py-2 ui:text-base ui:text-primary-500 ui:placeholder-primary-500 ui:shadow-sm ui:transition-all ui:duration-200 ui:outline-none ui:focus:border-primary-900 ui:focus:ring ui:disabled:pointer-events-none ui:disabled:cursor-not-allowed ui:disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
export default Input;
