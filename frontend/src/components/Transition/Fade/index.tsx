import { cloneElement, forwardRef, ReactElement, useCallback, useRef } from 'react';

import get from 'lodash.get';
import { Transition, TransitionStatus } from 'react-transition-group';
import { EnterHandler, ExitHandler, TransitionProps } from 'react-transition-group/Transition';

import useForkRef from '@/hooks/useForkRef';
import config from '@/utils/config';

import { easing } from '../constants';
import { getTransitionProps, TransitionTimeout } from '../utils';

export type FadeProps = React.PropsWithChildren<TransitionProps>;

const styles: Partial<Record<TransitionStatus, React.CSSProperties>> = {
  entering: {
    opacity: 1,
  },
  entered: {
    opacity: 1,
  },
};

const defaultTimeout = {
  enter: 225,
  exit: 195,
};

const defaultProps = {
  easing: { enter: easing.easeOut, exit: easing.sharp },
};

const Fade = forwardRef<unknown, FadeProps>(
  (
    {
      children,
      in: inProp,
      style,
      easing: defaultEasing,
      timeout: timeoutProp,
      addEndListener,
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited,
      ...props
    },
    ref
  ) => {
    const nodeRef = useRef<HTMLElement>(null);
    const foreignRef = useForkRef(get(children, 'ref'), ref);
    const handleRef = useForkRef(nodeRef, foreignRef);
    const timeout = (timeoutProp || defaultTimeout) as TransitionTimeout;

    const handleEntering: EnterHandler<HTMLElement> = useCallback(
      (isAppearing: boolean) => {
        const { current: node } = nodeRef;
        if (!node) throw Error('handleEntering Cannot be called with undefined node');
        if (onEntering) onEntering(node, isAppearing);
      },
      [onEntering]
    );

    const handleEntered: EnterHandler<HTMLElement> = useCallback(
      (isAppearing: boolean) => {
        const { current: node } = nodeRef;
        if (!node) throw Error('handleEntered Cannot be called with undefined node');
        if (onEntered) onEntered(node, isAppearing);
      },
      [onEntered]
    );

    const handleExiting: ExitHandler<HTMLElement> = useCallback(() => {
      const { current: node } = nodeRef;
      if (!node) throw Error('handleExiting Cannot be called with undefined node');
      if (onExiting) onExiting(node);
    }, [onExiting]);

    const handleExited: ExitHandler<HTMLElement> = useCallback(() => {
      const { current: node } = nodeRef;
      if (!node) throw Error('handleExited Cannot be called with undefined node');
      if (onExited) onExited(node);
    }, [onExited]);

    const handleEnter: EnterHandler<HTMLElement> = useCallback(
      (isAppearing: boolean) => {
        const { current: node } = nodeRef;
        if (!node) throw Error('handleEnter Cannot be called with undefined node');

        // This is for to force a repaint,
        // which is necessary in order to transition styles
        // https://github.com/reactjs/react-transition-group/issues/159
        node.scrollTop = 0; // So the animation always start from the start.

        const {
          duration,
          easing: transitionEasing,
          delay,
        } = getTransitionProps(
          {
            transitionDelay: style?.transitionDelay,
            timeout,
            easeConfig: { easing: defaultEasing || defaultProps.easing },
          },
          { mode: 'enter' }
        );

        node.style.transition = `opacity ${duration}ms ${transitionEasing} ${delay}`;

        if (onEnter) onEnter(node, isAppearing);
      },
      [defaultEasing, onEnter, style?.transitionDelay, timeout]
    );

    const handleExit: ExitHandler<HTMLElement> = useCallback(() => {
      const { current: node } = nodeRef;
      if (!node) throw Error('handleExit Cannot be called with undefined node');

      const {
        duration,
        easing: transitionEasing,
        delay,
      } = getTransitionProps(
        {
          transitionDelay: style?.transitionDelay,
          timeout,
          easeConfig: { easing: defaultEasing || defaultProps.easing },
        },
        { mode: 'exit' }
      );

      node.style.transition = `opacity ${duration}ms ${transitionEasing} ${delay}`;

      if (onExit) onExit(node);
    }, [defaultEasing, onExit, style?.transitionDelay, timeout]);

    const handleAddEndListener = useCallback(
      (done: () => void) => {
        const { current: node } = nodeRef;
        if (!node) throw Error('handleAddListener Cannot be called with undefined node');
        if (addEndListener) addEndListener(node, done);
      },
      [addEndListener]
    );

    return (
      <Transition
        {...props}
        nodeRef={nodeRef}
        in={inProp}
        timeout={timeout}
        onEnter={handleEnter}
        onEntered={handleEntered}
        onEntering={handleEntering}
        onExit={handleExit}
        onExiting={handleExiting}
        onExited={handleExited}
        addEndListener={handleAddEndListener}
      >
        {(state) =>
          cloneElement(children as ReactElement, {
            ref: handleRef,
            style: {
              opacity: 0,
              visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
              ...styles[state],
              ...style,
              ...(get(children, 'props.style') as unknown as React.CSSProperties),
            },
          })
        }
      </Transition>
    );
  }
);

if (config.isDev) {
  Fade.displayName = 'Fade';
}

export default Fade;
