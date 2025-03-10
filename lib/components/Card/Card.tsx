import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  testId: string;
  children: ReactNode;
}

const Card = ({ className, testId, children, ...props }: CardProps) => {
  return (
    <div
      data-testid={testId}
      className={cn(["ui-flex ui-flex-col", className])}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
