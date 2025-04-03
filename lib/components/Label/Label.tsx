import { cn } from "@/utils/cn";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type LabelProps = ComponentPropsWithoutRef<"label"> & {};

const Label = forwardRef<React.ElementRef<"label">, LabelProps>(
  ({ className, ...props }, ref) => {
    return <label ref={ref} className={cn("", className)} {...props} />;
  },
);

export default Label;
