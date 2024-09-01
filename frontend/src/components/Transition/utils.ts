import { TransitionActions } from 'react-transition-group/Transition';

export type TransitionTimeout = number | Record<'enter' | 'exit', number>;
export type EasingProps = {
  easing: string | { enter?: string | undefined; exit?: string | undefined };
};

export const getTransitionProps = (
  props: { timeout: TransitionTimeout; easeConfig: EasingProps; transitionDelay?: string },
  options: { mode: keyof Omit<TransitionActions, 'appear'> }
): { duration: number; easing: string; delay: string } => {
  const {
    timeout,
    easeConfig: { easing },
    transitionDelay,
  } = props;
  const { mode } = options;

  return {
    duration: typeof timeout === 'number' ? timeout : timeout[mode],
    easing: typeof easing === 'string' ? easing : (easing[mode] as string),
    delay: transitionDelay || '0ms',
  };
};

export const getAutoHeightDuration = (height: number | null): number => {
  if (!height) {
    return 0;
  }

  const constant = height / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
};
