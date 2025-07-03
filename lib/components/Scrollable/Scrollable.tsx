import useThrottle from '@/hooks/useThrottle';
import { cn } from '@/utils/cn';
import { PolymorphicComponent } from '@/utils/types';
import { ScrollableVariants } from '@/utils/variants';
import { VariantProps } from 'class-variance-authority';
import { UIEvent, useCallback } from 'react';

type ScrollableProps<C extends React.ElementType> = VariantProps<typeof ScrollableVariants> &
  PolymorphicComponent<
    C,
    {
      as?: C;
      testId?: string;
      scrollThreshold?: number;
      scrollThrottleDelay?: number;
      disableScrollThrottle?: boolean;
      onScroll?: (e: UIEvent<HTMLElement>) => void;
      onReachTop?: () => void;
      onReachBottom?: () => void;
    }
  >;

const Scrollable = <C extends React.ElementType = 'div'>({
  as,
  direction,
  scrollBar,
  smooth = false,
  scrollThreshold = 10,
  scrollThrottleDelay = 100,
  disableScrollThrottle = false,
  onScroll,
  onReachTop,
  onReachBottom,
  className,
  children,
  testId = 'scrollable',
  ...props
}: ScrollableProps<C>) => {
  const Tag = as || 'div';

  const internalScrollHandler = useCallback(
    (e: UIEvent<HTMLElement>) => {
      onScroll?.(e);
      const target = e.currentTarget;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      if (onReachTop && scrollTop <= scrollThreshold) {
        onReachTop();
      }

      if (onReachBottom && scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
        onReachBottom();
      }
    },
    [scrollThreshold, onScroll, onReachTop, onReachBottom]
  );

  const handleScroll = disableScrollThrottle
    ? internalScrollHandler
    : useThrottle(internalScrollHandler, scrollThrottleDelay);

  return (
    <Tag
      data-testid={testId}
      className={cn(ScrollableVariants({ direction, scrollBar, smooth }), className)}
      {...props}
      onScroll={handleScroll}
    >
      {children}
    </Tag>
  );
};

Scrollable.displayName = 'Scrollable';

export default Scrollable;
