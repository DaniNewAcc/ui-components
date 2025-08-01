import React, { forwardRef } from 'react';

export type TriggerProps = {
  testId?: string;
  children: React.ReactElement;
  onTrigger?: () => void;
};

const Trigger = forwardRef<HTMLElement, TriggerProps>(
  ({ children, testId = 'trigger', onTrigger }, ref) => {
    return React.cloneElement(children, {
      ref,
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        onTrigger?.();
      },
      ...(testId && { 'data-testid': testId }),
    });
  }
);

Trigger.displayName = 'Trigger';

export default Trigger;
