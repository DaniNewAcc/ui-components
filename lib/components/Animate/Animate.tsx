import useReduceMotion from '@/hooks/useReduceMotion';
import { useSyncAnimation } from '@/hooks/useSyncAnimation'; // Import the hook
import { cn } from '@/utils/cn';
import { AnimationPresetKey, animationPresets } from '@/utils/preset';
import { AnimationVariants } from '@/utils/variants';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';

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
    isVisible: boolean;
    testId?: string;
    animateHeight?: boolean;
    style?: React.CSSProperties;
    onStart?: () => void;
    onEnd?: () => void;
    onAnimationChange?: (isAnimating: boolean) => void;
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
      children,
      isVisible,
      testId = 'animate',
      animateHeight = false,
      style,
      onStart,
      onEnd,
      onAnimationChange,
      ...props
    }: AnimateProps,
    forwardedRef
  ) => {
    // check if a preset is entered by the user
    const presetValues: Partial<VariantProps<typeof AnimationVariants>> = preset
      ? (animationPresets[preset] ?? {})
      : {};

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
    const timeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
    const animationTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

    // delay enter and exit animation for preventing flickers and layout shifts
    useLayoutEffect(() => {
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(true);
        onStart?.();
        onAnimationChange?.(true);

        if (animateHeight) {
          if (isVisible) {
            startOpenAnimation();
          } else {
            startCloseAnimation();
          }
        }

        animationTimeoutRef.current = setTimeout(() => {
          resetAnimation();
          setShouldRender(isVisible);
          onEnd?.();
          onAnimationChange?.(false);
        }, duration);
      }, delay);

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      };
    }, [isVisible, animateHeight, duration, delay, onStart, onEnd, onAnimationChange]);

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
          overflow: animateHeight ? 'hidden' : undefined,
          maxHeight: animateHeight ? maxHeight : undefined,
          transition: animateHeight ? `max-height ${duration}ms ease` : undefined,
          willChange: animateHeight ? 'max-height' : undefined,
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
