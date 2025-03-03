import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  className: string;
  children: ReactNode;
}

const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn(["ui-flex ui-flex-col", className])} {...props}>
      {children}
    </div>
  );
};

export default Card;
