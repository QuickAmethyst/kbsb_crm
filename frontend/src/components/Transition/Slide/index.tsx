// https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Slide/Slide.js
import {
  cloneElement,
  CSSProperties,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';

import useForkRef from 'src/hooks/useForkRef';

import config from '@/utils/config';
import debounce from '@/utils/debounce';
import easing from '@/utils/easing';

import { getTransitionProps, TransitionTimeout } from '../utils';

export type SlideDirection = 'up' | 'down' | 'left' | 'right';
export type SlideProps = TransitionProps & {
  children: ReactNode;
  direction?: SlideDirection;
};

// Translate the node so it can't be seen on the screen.
// Later, we're going to translate the node back to its original location with `none`.
const getTranslateValue = <T extends HTMLElement>(direction: SlideDirection, node: T): string => {
  const rect = node.getBoundingClientRect();
  const containerDocument = node.ownerDocument || document;
  const containerWindow = containerDocument.defaultView || window;

  const computedStyle = containerWindow.getComputedStyle(node);
  const transform =
    computedStyle.getPropertyValue('-webkit-transform') ||
    computedStyle.getPropertyValue('transform');

  let offsetX = 0;
  let offsetY = 0;

  if (transform && transform !== 'none' && typeof transform === 'string') {
    const transformValues = transform.split('(')[1].split(')')[0].split(',');
    offsetX = parseInt(transformValues[4], 10);
    offsetY = parseInt(transformValues[5], 10);
  }

  if (direction === 'left') {
    return `translateX(${containerWindow.innerWidth}px) translateX(${offsetX - rect.left}px)`;
  }

  if (direction === 'right') {
    return `translateX(-${rect.left + rect.width - offsetX}px)`;
  }

  if (direction === 'up') {
    return `translateY(${containerWindow.innerHeight}px) translateY(${offsetY - rect.top}px)`;
  }

  // direction === 'down'
  return `translateY(-${rect.top + rect.height - offsetY}px)`;
};

const setTranslateValue = <T extends HTMLElement>(direction: SlideDirection, node: T): void => {
  const transform = getTranslateValue(direction, node);

  if (transform) {
    /* eslint-disable no-param-reassign */
    node.style.transform = transform;
    /* eslint-enable no-param-reassign */
  }
};

const defaultProps = {
  direction: 'down' as SlideDirection,
  timeout: { enter: 225, exit: 195 },
  appear: true,
  easing: { enter: easing.easeOut, exit: easing.sharp },
};

const Slide = forwardRef<HTMLElement, SlideProps>(
  (
    {
      children,
      in: inProp,
      direction: defaultDirection,
      timeout,
      easing: defaultEasing,
      style,
      onEnter,
      onEntering,
      onEntered,
      onExiting,
      onExit,
      onExited,
      addEndListener,
      ...other
    },
    ref
  ) => {
    const childrenRef = useRef<HTMLElement>(null);
    const handleRefIntermediary = useForkRef(
      (children as unknown as { ref: Ref<HTMLElement> }).ref,
      childrenRef
    );

    const handleRef = useForkRef(handleRefIntermediary, ref);
    const direction = defaultDirection || defaultProps.direction;

    const handleOnEnter = useCallback(
      (isAppearing: boolean) => {
        const { current: node } = childrenRef;
        if (!node) throw Error('handleOnEnter Cannot be called with undefined node');

        setTranslateValue(direction || defaultProps.direction, node);

        // This is for to force a repaint,
        // which is necessary in order to transition styles
        // https://github.com/reactjs/react-transition-group/issues/159
        node.scrollTop = 0;

        if (onEnter) onEnter(node, isAppearing);
      },
      [direction, onEnter]
    );

    const handleOnEntering = useCallback(
      (isAppearing: boolean) => {
        const { current: node } = childrenRef;
        if (!node) throw Error('handleOnEntering Cannot be called with undefined node');

        const {
          duration,
          easing: transitionEasing,
          delay,
        } = getTransitionProps(
          {
            timeout: (timeout as TransitionTimeout) || defaultProps.timeout,
            transitionDelay: style?.transitionDelay,
            easeConfig: { easing: defaultEasing || defaultProps.easing },
          },
          { mode: 'enter' }
        );

        node.style.transition = `transform ${duration}ms ${transitionEasing} ${delay}`;

        node.style.transform = 'none';

        if (onEntering) onEntering(node, isAppearing);
      },
      [defaultEasing, onEntering, style?.transitionDelay, timeout]
    );

    const handleOnEntered = useCallback(
      (isAppearing: boolean) => {
        const { current: node } = childrenRef;
        if (!node) throw Error('handleOnEntered Cannot be called with undefined node');

        if (onEntered) onEntered(node, isAppearing);
      },
      [onEntered]
    );

    const handleOnExiting = useCallback(() => {
      const { current: node } = childrenRef;
      if (!node) throw Error('handleOnExiting Cannot be called with undefined node');

      if (onExiting) onExiting(node);
    }, [onExiting]);

    const handleOnExited = useCallback(() => {
      const { current: node } = childrenRef;
      if (!node) throw Error('handleOnExited Cannot be called with undefined node');

      if (onExited) onExited(node);
    }, [onExited]);

    const handleOnExit = useCallback(() => {
      const { current: node } = childrenRef;
      if (!node) throw Error('handleOnExit Cannot be called with undefined node');

      const {
        duration,
        easing: transitionEasing,
        delay,
      } = getTransitionProps(
        {
          timeout: (timeout as TransitionTimeout) || defaultProps.timeout,
          transitionDelay: style?.transitionDelay,
          easeConfig: { easing: defaultEasing || defaultProps.easing },
        },
        { mode: 'exit' }
      );

      node.style.transition = `transform ${duration}ms ${transitionEasing} ${delay}`;

      setTranslateValue(direction, node);

      if (onExit) onExit(node);
    }, [defaultEasing, direction, onExit, style?.transitionDelay, timeout]);

    const handleResize = useRef(
      debounce(() => {
        if (childrenRef.current) {
          setTranslateValue(direction, childrenRef.current);
        }
      })
    ).current;

    const updatePosition = useCallback(() => {
      if (childrenRef.current) {
        setTranslateValue(direction, childrenRef.current);
      }
    }, [direction]);

    const handleAddEndListener = useCallback(
      (done: () => void) => {
        const { current: node } = childrenRef;
        if (!node) throw Error('handleAddListener Cannot be called with undefined node');
        if (addEndListener) addEndListener(node, done);
      },
      [addEndListener]
    );

    useEffect(() => {
      // Skip configuration where the position is screen size invariant.
      if (inProp || direction === 'down' || direction === 'right') {
        return undefined;
      }

      const { current: node } = childrenRef;
      const containerDocument = node?.ownerDocument || document;
      const containerWindow = containerDocument.defaultView || window;
      containerWindow.addEventListener('resize', handleResize);

      return () => {
        containerWindow.removeEventListener('resize', handleResize);
      };
    }, [direction, handleResize, inProp]);

    useEffect(() => {
      if (!inProp) {
        // We need to update the position of the drawer when the direction change and
        // when it's hidden.
        updatePosition();
      }
    }, [inProp, updatePosition]);

    return (
      <Transition
        {...other}
        nodeRef={childrenRef}
        in={inProp}
        timeout={timeout || defaultProps.timeout}
        onEnter={handleOnEnter}
        onEntering={handleOnEntering}
        onEntered={handleOnEntered}
        onExiting={handleOnExiting}
        onExit={handleOnExit}
        onExited={handleOnExited}
        addEndListener={handleAddEndListener}
      >
        {(state) =>
          cloneElement(children as ReactElement, {
            ref: handleRef,
            style: {
              visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
              ...style,
              ...((children as { props: { style: CSSProperties } }).props
                .style as React.CSSProperties),
            },
          })
        }
      </Transition>
    );
  }
);

Slide.defaultProps = defaultProps;

if (config.isDev) {
  Slide.displayName = 'Slide';
}

export default Slide;
