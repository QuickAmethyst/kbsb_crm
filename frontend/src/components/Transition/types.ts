import { TransitionProps as _TransitionProps } from 'react-transition-group/Transition';

export type TransitionHandlerKeys =
  | 'onEnter'
  | 'onEntering'
  | 'onEntered'
  | 'onExit'
  | 'onExiting'
  | 'onExited';

export type TransitionHandlerProps = Pick<_TransitionProps, TransitionHandlerKeys>;

export type TransitionEase = 'easeInOut' | 'easeOut' | 'easeIn' | 'sharp';
