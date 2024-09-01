import {
  ElementType,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useState,
} from 'react';

import { Instance, OptionsGeneric, Placement } from '@popperjs/core';
import { TransitionProps } from 'react-transition-group/Transition';

import Portal, { PortalProps } from '@/components/Portal';
import { TransitionHandlerKeys } from '@/components/Transition/types';
import config from '@/utils/config';
import ownerDocument from '@/utils/ownerDocument';

import PopperTooltip, { PopperTooltipProps } from './PopperTooltip';

export type PopperProps = PropsWithChildren<
  Omit<PopperTooltipProps, 'placement'> & {
    id?: string;
    className?: string;
    placement?: Placement;
    container?: PortalProps['container'];
    keepMounted?: boolean;
    popperOptions?: Partial<OptionsGeneric<unknown>>;
    Transition?: ElementType<
      Pick<TransitionProps, TransitionHandlerKeys | 'in' | 'appear' | 'children'>
    >;
  }
>;

function resolveAnchorEl(anchorEl: unknown): Element {
  return (typeof anchorEl === 'function' ? anchorEl() : anchorEl) as Element;
}

const Popper = forwardRef<Instance, PopperProps>(
  (
    {
      anchorEl,
      children,
      container: containerProp,
      disablePortal = false,
      keepMounted = false,
      modifiers,
      open,
      placement = 'bottom',
      popperOptions = {},
      popperRef,
      style,
      Transition,
      ...other
    },
    ref
  ) => {
    const [exited, setExited] = useState(true);

    const handleEnter = useCallback(() => {
      setExited(false);
    }, []);

    const handleExited = useCallback(() => {
      setExited(true);
    }, []);

    if (!keepMounted && !open && (!Transition || exited)) {
      return null;
    }

    // If the container prop is provided, use that
    // If the anchorEl prop is provided, use its parent body element as the container
    // If neither are provided let the Modal take care of choosing the container
    const container =
      containerProp || (anchorEl ? ownerDocument(resolveAnchorEl(anchorEl)).body : undefined);

    return (
      <Portal disablePortal={disablePortal} container={container as ReactElement}>
        <PopperTooltip
          ref={ref}
          anchorEl={anchorEl}
          disablePortal={disablePortal}
          modifiers={modifiers}
          open={Transition ? !exited : open}
          placement={placement}
          popperOptions={popperOptions}
          popperRef={popperRef}
          {...other}
          style={{
            // Prevents scroll issue, waiting for Popper.js to add this style once initiated.
            position: 'fixed',
            // Fix Popper.js display issue
            top: 0,
            left: 0,
            display: !open && keepMounted && !Transition ? 'none' : undefined,
            ...style,
          }}
        >
          {!Transition && children}
          {Transition && (
            <Transition appear in={open} onEnter={handleEnter} onExited={handleExited}>
              {children}
            </Transition>
          )}
        </PopperTooltip>
      </Portal>
    );
  }
);

if (config.isDev) {
  Popper.displayName = 'Popper';
}

export default Popper;
