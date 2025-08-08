import React, { cloneElement, forwardRef, HTMLAttributes } from 'react';

export type TriggerProps<T extends HTMLElement> = {
  testId?: string;
  children: React.ReactElement;
  onTrigger?: () => void;
} & HTMLAttributes<T>;

const Trigger = forwardRef(
  <T extends HTMLElement>(
    { children, testId = 'trigger', onTrigger, ...props }: TriggerProps<T>,
    ref: React.Ref<T>
  ) => {
    return cloneElement(children, {
      ref,
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        onTrigger?.();
      },
      ...(testId && { 'data-testid': testId }),
      ...props,
    });
  }
);

Trigger.displayName = 'Trigger';

export default Trigger;
