import useReduceMotion from '@/hooks/useReduceMotion';
import { useSyncAnimation } from '@/hooks/useSyncAnimation';
import { cn } from '@/utils/cn';
import { AnimationPresetKey, animationPresets } from '@/utils/preset';
import { AnimationVariants } from '@/utils/variants';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

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
      updateSizes,
      handleExpand,
      handleCollapse,
      setShouldRender,
    } = useSyncAnimation({
      isOpen: isVisible,
      duration,
    });
    const reduceMotion = useReduceMotion();
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const shouldAnimate = !disabled && !reduceMotion;

    // helper functions for handling enter and exit animations
    const startOpenAnimation = useCallback(() => {
      if (!animateHeight) return;
      if (syncRef.current) {
        handleExpand();
      }
    }, [animateHeight, handleExpand]);

    const startCloseAnimation = useCallback(() => {
      if (!animateHeight) return;
      if (syncRef.current) {
        handleCollapse();
      }
    }, [animateHeight, handleCollapse]);

    const resetAnimation = useCallback(() => {
      updateSizes('auto');
      setIsAnimating(false);
    }, [updateSizes]);

    // allow the user to access internal methods in parent component
    useImperativeHandle(forwardedRef, () => ({
      startOpenAnimation,
      startCloseAnimation,
    }));

    const timeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
    const animationTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

    // It runs animation with delay on enter and exit for preventing flickers and layout shifts
    const runAnimation = useCallback(() => {
      // If animations are disabled update rendering state and skip animation logic
      if (!shouldAnimate) {
        setShouldRender(isVisible);
        return;
      }

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(true);
        onStart?.();
        onAnimationChange?.(true);

        if (isVisible) {
          startOpenAnimation();
        } else {
          startCloseAnimation();
        }

        animationTimeoutRef.current = setTimeout(() => {
          resetAnimation();
          setShouldRender(isVisible);
          onEnd?.();
          onAnimationChange?.(false);
        }, duration);
      }, delay);
    }, [
      isVisible,
      delay,
      duration,
      onStart,
      onEnd,
      onAnimationChange,
      startOpenAnimation,
      startCloseAnimation,
      resetAnimation,
    ]);

    useLayoutEffect(() => {
      runAnimation();

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      };
    }, [runAnimation]);

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
        aria-expanded={isVisible}
        aria-hidden={!isVisible}
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

Animate.displayName = 'Animate';

export default Animate;
