import React, { forwardRef, useCallback, useRef } from 'react';

import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';

import useForkRef from 'src/hooks/useForkRef';

import config from '@/utils/config';
import easing from '@/utils/easing';

import { getAutoHeightDuration, getTransitionProps, TransitionTimeout } from '../utils';

export type CollapseOrientation = 'vertical' | 'horizontal';
export type CollapseProps = React.PropsWithChildren<
  Omit<TransitionProps, 'timeout'> & {
    timeout?: 'auto' | TransitionTimeout;
    orientation?: CollapseOrientation;
    collapsedSize?: number;
  }
>;

const defaultProps = {
  timeout: 300,
  oritentation: 'vertical',
  collapsedSize: 0,
  easing: { enter: easing.easeOut, exit: easing.sharp },
};

const Collapse = forwardRef<HTMLElement, CollapseProps>(
  (
    {
      in: inProp,
      timeout: timeoutProp,
      collapsedSize: collapsedSizeProp,
      orientation,
      style,
      easing: defaultEasing,
      children,
      onEnter,
      onEntering,
      onEntered,
      onExiting,
      onExit,
      onExited,
      ...otherProps
    },
    ref
  ) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const handleRef = useForkRef<HTMLElement>(ref, nodeRef);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const timeout = timeoutProp || defaultProps.timeout;
    const collapsedSize = collapsedSizeProp || defaultProps.collapsedSize;

    const autoTransitionDuration = React.useRef<number | null>(null);
    const timer = React.useRef<number | null>();
    const isHorizontal = orientation === 'horizontal';
    const size = isHorizontal ? 'width' : 'height';
    const getWrapperSize = React.useCallback(
      () =>
        wrapperRef.current ? wrapperRef.current[isHorizontal ? 'clientWidth' : 'clientHeight'] : 0,
      [isHorizontal]
    );

    React.useEffect(
      () => () => {
        if (timer.current) clearTimeout(timer.current);
      },
      []
    );

    const handleEnter = React.useCallback(
      (isAppearing: boolean) => {
        if (!nodeRef.current || !wrapperRef.current)
          throw Error('handleOnEnter Cannot be called with undefined node');
        if (isHorizontal) {
          // Set absolute position to get the size of collapsed content
          wrapperRef.current.style.position = 'absolute';
        }

        nodeRef.current.style[size] = `${collapsedSize}px`;

        if (onEnter) onEnter(nodeRef.current, isAppearing);
      },
      [collapsedSize, isHorizontal, onEnter, size]
    );

    const handleEntering = React.useCallback(
      (isAppearing: boolean) => {
        const { current: node } = nodeRef;
        if (!node) throw Error('handleEntering Cannot be called with undefined node ');

        const wrapperSize = getWrapperSize();

        if (wrapperRef.current && isHorizontal) {
          // After the size is read reset the position back to default
          wrapperRef.current.style.position = '';
        }

        const { duration: transitionDuration, easing: transitionTimingFunction } =
          getTransitionProps(
            {
              timeout: timeout === 'auto' ? 0 : defaultProps.timeout,
              transitionDelay: style?.transitionDelay,
              easeConfig: { easing: defaultEasing || defaultProps.easing },
            },
            { mode: 'enter' }
          );

        if (timeout === 'auto') {
          const duration2 = getAutoHeightDuration(wrapperSize);

          node.style.transitionDuration = `${duration2}ms`;

          autoTransitionDuration.current = duration2;
        } else {
          node.style.transitionDuration =
            typeof transitionDuration === 'string' ? transitionDuration : `${transitionDuration}ms`;
        }

        node.style[size] = `${wrapperSize}px`;

        node.style.transitionTimingFunction = transitionTimingFunction;

        if (onEntering) onEntering(node, isAppearing);
      },
      [
        defaultEasing,
        getWrapperSize,
        isHorizontal,
        onEntering,
        size,
        style?.transitionDelay,
        timeout,
      ]
    );

    const handleEntered = React.useCallback(
      (isAppearing: boolean) => {
        const { current: node } = nodeRef;
        if (!node) throw Error('handleEntered Cannot be called with undefined node');

        node.style[size] = 'auto';

        if (onEntered) onEntered(node, isAppearing);
      },
      [onEntered, size]
    );

    const handleExit = React.useCallback(() => {
      const { current: node } = nodeRef;
      if (!node) throw Error('handleExit Cannot be called with undefined node');

      node.style[size] = `${getWrapperSize()}px`;

      if (onExit) onExit(node);
    }, [getWrapperSize, onExit, size]);

    const handleExited = React.useCallback(() => {
      const { current: node } = nodeRef;
      if (!node) throw Error('handleExited Cannot be called with undefined node');

      if (onExited) onExited(node);
    }, [onExited]);

    const handleExiting = React.useCallback(() => {
      const { current: node } = nodeRef;
      if (!node) throw Error('handleExiting Cannot be called with undefined node');

      const wrapperSize = getWrapperSize();
      const { duration: transitionDuration, easing: transitionTimingFunction } = getTransitionProps(
        {
          timeout: timeout === 'auto' ? 0 : defaultProps.timeout,
          transitionDelay: style?.transitionDelay,
          easeConfig: { easing: defaultEasing || defaultProps.easing },
        },
        { mode: 'exit' }
      );

      if (timeout === 'auto') {
        const duration2 = getAutoHeightDuration(wrapperSize);
        node.style.transitionDuration = `${duration2}ms`;
        autoTransitionDuration.current = duration2;
      } else {
        node.style.transitionDuration =
          typeof transitionDuration === 'string' ? transitionDuration : `${transitionDuration}ms`;
      }

      node.style[size] = `${collapsedSize}px`;

      node.style.transitionTimingFunction = transitionTimingFunction;

      if (onExiting) onExiting(node);
    }, [
      collapsedSize,
      defaultEasing,
      getWrapperSize,
      onExiting,
      size,
      style?.transitionDelay,
      timeout,
    ]);

    const addEndListener = useCallback(
      // eslint-disable-next-line @typescript-eslint/ban-types
      (next: Function) => {
        if (timeout === 'auto') {
          timer.current = setTimeout(next, autoTransitionDuration.current || 0);
        }
      },
      [timeout]
    );

    // state={state}
    //         orientation={orientation || (defaultProps.oritentation as CollapseOrientation)}
    //         collapsedSize={collapsedSize || defaultProps.collapsedSize}
    //         in={inProp}

    return (
      <Transition
        {...otherProps}
        nodeRef={nodeRef}
        in={inProp}
        timeout={timeout === 'auto' ? undefined : timeout || defaultProps.timeout}
        addEndListener={addEndListener}
        onEnter={handleEnter}
        onEntering={handleEntering}
        onEntered={handleEntered}
        onExit={handleExit}
        onExited={handleExited}
        onExiting={handleExiting}
      >
        {(state) => (
          <div className={classNames('container', orientation, state)} ref={handleRef}>
            <div className='wrapper' ref={wrapperRef}>
              <div className='inner'>{children}</div>
            </div>

            <style jsx>
              {`
                .container {
                  height: 0;
                  overflow: hidden;
                  transition: height 300ms ${easing.easeInOut} 0ms;
                }

                .container.horizontal {
                  height: auto;
                  width: 0;
                  transition: width 300ms ${easing.easeInOut} 0ms;
                }

                .container.entered {
                  height: auto;
                  overflow: visible;
                }

                .container.horizontal.entered {
                  width: auto;
                }

                .container.exited {
                  ${!inProp && collapsedSize === 0 ? 'visibility: hidden;' : ''}
                }

                .container > .wrapper {
                  display: flex;
                  width: 100%;
                }

                .container > .wrapper > .inner {
                  width: 100%;
                }

                .container.horizontal > .wrapper,
                .container.horizontal > .wrapper > .inner {
                  width: auto;
                  height: 100%;
                }
              `}
            </style>
          </div>
        )}
      </Transition>
    );
  }
);

Collapse.defaultProps = defaultProps;

if (config.isDev) {
  Collapse.displayName = 'Collapse';
}

export default Collapse;
