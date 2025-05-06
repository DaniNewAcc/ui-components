import { VariantProps } from 'class-variance-authority';
import { AnimationVariants } from './variants';

export const animationPresets: Record<string, Partial<VariantProps<typeof AnimationVariants>>> = {
  dropdown: {
    type: 'slideDown',
    exitType: 'slideUp',
    duration: 300,
    fillMode: 'forwards',
    easing: 'easeOut',
    exitEasing: 'easeIn',
  },
  toast: {
    type: 'fadeIn',
    exitType: 'fadeOut',
    duration: 500,
    easing: 'easeOut',
    exitEasing: 'easeIn',
  },
  modal: {
    type: 'zoomIn',
    exitType: 'fadeOut',
    duration: 500,
    fillMode: 'forwards',
    easing: 'easeOut',
    exitEasing: 'easeIn',
  },
};

export type AnimationPresetKey = keyof typeof animationPresets;
