import React from 'react';

type MockAnimateProps = {
  children: React.ReactNode;
  testId?: string;
};

const MockAnimate = ({ children, testId }: MockAnimateProps) => {
  return <div data-testid={testId}>{children}</div>;
};

export default MockAnimate;
