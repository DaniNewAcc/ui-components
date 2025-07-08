import { useEffect } from 'react';

type MockAnimateProps = {
  children: React.ReactNode;
  testId?: string;
  onAnimationChange?: (animating: boolean) => void;
};

const MockAnimate = ({ children, testId, onAnimationChange }: MockAnimateProps) => {
  useEffect(() => {
    onAnimationChange?.(true);
    onAnimationChange?.(false);
  }, [onAnimationChange]);

  return <div data-testid={testId}>{children}</div>;
};

export default MockAnimate;
