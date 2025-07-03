import useThrottle from '@/hooks/useThrottle';
import { cn } from '@/utils/cn';
import { PolymorphicComponent } from '@/utils/types';
import { ScrollableVariants } from '@/utils/variants';
import { VariantProps } from 'class-variance-authority';
import { UIEvent, useCallback, useRef } from 'react';

type ScrollDirection = 'up' | 'down';

interface ScrollState {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  isAtTop: boolean;
  isAtBottom: boolean;
  scrollDirection: ScrollDirection;
}

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
      onScrollStateChange?: (state: ScrollState) => void;
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
  className,
  children,
  testId = 'scrollable',
  onScroll,
  onReachTop,
  onReachBottom,
  onScrollStateChange,
  ...props
}: ScrollableProps<C>) => {
  const Tag = as || 'div';
  const previousScrollTop = useRef<number>(0);

  const internalScrollHandler = useCallback(
    (e: UIEvent<HTMLElement>) => {
      const target = e.currentTarget;
      if (!target) return;
      onScroll?.(e);

      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      const isAtTop = scrollTop <= scrollThreshold;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;

      const scrollDirection: ScrollDirection =
        scrollTop > previousScrollTop.current ? 'down' : 'up';

      previousScrollTop.current = scrollTop;

      onScrollStateChange?.({
        scrollTop,
        scrollHeight,
        clientHeight,
        isAtTop,
        isAtBottom,
        scrollDirection,
      });

      if (onReachTop && isAtTop) {
        onReachTop();
      }
      if (onReachBottom && isAtBottom) {
        onReachBottom();
      }
    },
    [scrollThreshold, onScroll, onReachTop, onReachBottom, onScrollStateChange]
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
