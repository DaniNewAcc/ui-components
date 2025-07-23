import { AnimationVariants } from '@utils/variants';
import { VariantProps } from 'class-variance-authority';

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
  sidebarLeft: {
    type: 'slideInLeft',
    exitType: 'slideOutLeft',
    duration: 300,
    fillMode: 'forwards',
    easing: 'easeOut',
    exitEasing: 'easeIn',
  },
  sidebarRight: {
    type: 'slideInRight',
    exitType: 'slideOutRight',
    duration: 300,
    fillMode: 'forwards',
    easing: 'easeOut',
    exitEasing: 'easeIn',
  },
};

export type AnimationPresetKey = keyof typeof animationPresets;
