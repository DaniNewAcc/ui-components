import { useEffect, useState } from 'react';

type MockAnimateProps = {
  children: React.ReactNode;
  testId?: string;
  isVisible: boolean;
  onAnimationChange?: (animating: boolean) => void;
};

const MockAnimate = ({ children, testId, isVisible, onAnimationChange }: MockAnimateProps) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    let timeout: number;

    if (isVisible) {
      onAnimationChange?.(true);
      setShouldRender(true);
      timeout = window.setTimeout(() => {
        onAnimationChange?.(false);
      }, 0);
    } else {
      onAnimationChange?.(true);
      timeout = window.setTimeout(() => {
        onAnimationChange?.(false);
        setShouldRender(false);
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [isVisible, onAnimationChange]);

  return shouldRender ? <div data-testid={testId}>{children}</div> : null;
};

export default MockAnimate;
