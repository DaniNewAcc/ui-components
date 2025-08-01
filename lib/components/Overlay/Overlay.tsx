import { cn } from '@utils/cn';
import { ComponentPropsWithoutRef, useCallback } from 'react';

export type OverlayProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
  closeOnClickOutside?: boolean;
  zIndex?: number;
  opacity?: number;
  onClickOutside?: () => void;
};

const Overlay = ({
  className,
  closeOnClickOutside = true,
  onClickOutside,
  zIndex = 40,
  opacity = 0.5,
  testId = 'overlay',
  ...props
}: OverlayProps) => {
  const handleClick = useCallback(() => {
    if (closeOnClickOutside && onClickOutside) {
      onClickOutside();
    }
  }, [closeOnClickOutside, onClickOutside]);

  return (
    <div
      data-testid={testId}
      aria-hidden="true"
      className={cn(
        'ui:fixed ui:inset-0',
        `ui:z-[${zIndex}]`,
        `ui:bg-black ui:opacity-${opacity * 100}`,
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
};

Overlay.displayName = 'Overlay';

export default Overlay;
