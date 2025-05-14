import useReduceMotion from '@/hooks/useReduceMotion';
import { useSyncAnimation } from '@/hooks/useSyncAnimation'; // Import the hook
import { cn } from '@/utils/cn';
import { AnimationPresetKey, animationPresets } from '@/utils/preset';
import { AnimationVariants } from '@/utils/variants';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef, useImperativeHandle, useLayoutEffect, useState } from 'react';

type AnimateMethods = {
  startOpenAnimation: () => void;
  startCloseAnimation: () => void;
};

export type AnimateProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof AnimationVariants> & {
    preset?: AnimationPresetKey;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
    isVisible: boolean;
    testId?: string;
    useHeightAnimation?: boolean;
    style?: React.CSSProperties;
  };

const Animate = forwardRef<AnimateMethods, AnimateProps>(
  (
    {
      preset,
      type: userType,
      exitType: userExitType,
      duration: userDuration,
      delay: userDelay,
      repeat: userRepeat,
      fillMode: userFillMode,
      easing: userEasing,
      exitEasing: userExitEasing,
      className,
      disabled,
      onStart,
      onEnd,
      children,
      isVisible,
      testId,
      useHeightAnimation = false,
      style,
      ...props
    }: AnimateProps,
    forwardedRef
  ) => {
    // check if a preset is entered by the user
    const presetValues = preset ? (animationPresets[preset] ?? {}) : {};

    // make styles inside the preset overridable by the user
    const type = userType ?? presetValues.type;
    const exitType = userExitType ?? presetValues.exitType;
    const duration = userDuration ?? presetValues.duration ?? 300;
    const delay = userDelay ?? presetValues.delay ?? 0;
    const repeat = userRepeat ?? presetValues.repeat;
    const fillMode = userFillMode ?? presetValues.fillMode;
    const easing = userEasing ?? presetValues.easing;
    const exitEasing = userExitEasing ?? presetValues.exitEasing;

    const {
      ref: syncRef,
      shouldRender,
      maxHeight,
      setMaxHeight,
      setShouldRender,
    } = useSyncAnimation({
      isOpen: isVisible,
      duration,
    });
    const reduceMotion = useReduceMotion();
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const shouldAnimate = !disabled && !reduceMotion;

    // helper functions for handling enter and exit animations
    const startOpenAnimation = () => {
      if (syncRef.current) {
        const fullHeight = syncRef.current.scrollHeight;
        setMaxHeight(`${fullHeight}px`);
      }
    };

    const startCloseAnimation = () => {
      if (syncRef.current) {
        setMaxHeight('0px');
      }
    };

    const resetAnimation = () => {
      setMaxHeight('auto');
      setIsAnimating(false);
    };

    // allow the user to access internal methods in parent component
    useImperativeHandle(forwardedRef, () => ({
      startOpenAnimation,
      startCloseAnimation,
    }));

    // delay enter and exit animation for preventing flickers and layout shifts
    useLayoutEffect(() => {
      let animationTimeout: ReturnType<typeof setTimeout>;

      const timeoutRef = setTimeout(() => {
        if (isVisible) {
          setIsAnimating(true);
          onStart?.();
          if (useHeightAnimation) startOpenAnimation();
        } else {
          setIsAnimating(true);
          onStart?.();
          if (useHeightAnimation) startCloseAnimation();
        }

        animationTimeout = setTimeout(() => {
          resetAnimation();
          setShouldRender(isVisible);
          onEnd?.();
        }, duration);
      }, delay);

      return () => {
        clearTimeout(timeoutRef);
        clearTimeout(animationTimeout); // <- this will now always run
      };
    }, [isVisible, duration, onStart, onEnd, delay, useHeightAnimation]);

    if (!shouldRender) return null;

    const animationClass = shouldAnimate
      ? AnimationVariants({
          type: isVisible ? type : exitType,
          duration,
          delay,
          repeat,
          fillMode,
          easing: isVisible ? easing : exitEasing,
        })
      : '';

    return (
      <div
        ref={syncRef}
        data-testid={testId}
        className={cn(animationClass, className, {
          'is-animating': isAnimating,
          'is-animating-enter': isAnimating && isVisible,
          'is-animating-exit': isAnimating && !isVisible,
        })}
        style={{
          overflow: useHeightAnimation ? 'hidden' : undefined,
          maxHeight: useHeightAnimation ? maxHeight : undefined,
          transition: useHeightAnimation ? `max-height ${duration}ms ease` : undefined,
          willChange: useHeightAnimation ? 'max-height' : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export default Animate;
