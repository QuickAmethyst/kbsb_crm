import React, {
  CSSProperties,
  PropsWithChildren,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Instance, Options, OptionsGeneric, Placement, createPopper } from '@popperjs/core';
import get from 'lodash.get';

import useForkRef from '@/hooks/useForkRef';
import config from '@/utils/config';

export type PopperTooltipProps = PropsWithChildren<{
  open?: boolean;
  placement: Placement;
  anchorEl?: HTMLElement;
  disablePortal?: boolean;
  modifiers?: Options['modifiers'];
  popperRef?: Ref<Instance>;
  popperOptions?: Partial<OptionsGeneric<unknown>>;
  style?: CSSProperties;
}>;

function resolveAnchorEl(anchorEl: HTMLElement | Function) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}

const PopperTooltip = forwardRef<Instance, PopperTooltipProps>(
  (
    {
      children,
      open,
      anchorEl,
      modifiers,
      disablePortal,
      placement: placementProp,
      popperRef: popperRefProp,
      popperOptions,
      ...other
    },
    ref
  ) => {
    const [placement, setPlacement] = useState(placementProp);
    const tooltipRef = useRef<HTMLElement>(null);
    const ownRef = useForkRef(tooltipRef, ref as unknown as Ref<HTMLElement>);
    const popperRef = useRef<Instance>(null);
    const handlePopperRef = useForkRef(popperRef, popperRefProp);
    const handlePopperRefRef = useRef(handlePopperRef);

    useImperativeHandle(ref, () => popperRef.current as Instance, []);

    useEffect(() => {
      if (popperRef.current) popperRef.current.forceUpdate();
    });

    useEffect(() => {
      handlePopperRefRef.current = handlePopperRef;
    }, [handlePopperRef]);

    useEffect(() => {
      if (!anchorEl || !open || !tooltipRef.current || !handlePopperRefRef.current)
        return undefined;

      const resolvedAnchorEl = resolveAnchorEl(anchorEl);

      if (config.isDev) {
        if (resolvedAnchorEl && get(resolvedAnchorEl, 'nodeType') === 1) {
          const box = resolvedAnchorEl.getBoundingClientRect();

          if (
            process.env.NODE_ENV !== 'test' &&
            box.top === 0 &&
            box.left === 0 &&
            box.right === 0 &&
            box.bottom === 0
          ) {
            // eslint-disable-next-line no-console
            console.warn(
              [
                'The `anchorEl` prop provided to the component is invalid.',
                'The anchor element should be part of the document layout.',
                "Make sure the element is present in the document or that it's not display none.",
              ].join('\n')
            );
          }
        }
      }

      let popperModifiers: typeof modifiers = [
        {
          name: 'preventOverflow',
          options: {
            altBoundary: disablePortal,
          },
        },
        {
          name: 'flip',
          options: {
            altBoundary: disablePortal,
          },
        },
        {
          name: 'onUpdate',
          enabled: true,
          phase: 'afterWrite',
          fn: ({ state }) => setPlacement(state.placement),
        },
      ];

      if (modifiers != null) {
        popperModifiers = popperModifiers.concat(modifiers);
      }
      if (popperOptions && popperOptions.modifiers != null) {
        popperModifiers = popperModifiers.concat(popperOptions.modifiers as never);
      }

      const popper = createPopper(resolveAnchorEl(anchorEl), tooltipRef.current, {
        placement,
        ...popperOptions,
        modifiers: popperModifiers,
      });

      handlePopperRefRef.current(popper);

      return () => {
        popper.destroy();
        if (handlePopperRefRef.current) handlePopperRefRef.current(null);
      };
    }, [anchorEl, disablePortal, modifiers, open, placement, popperOptions]);

    return (
      <div ref={ownRef} role='tooltip' {...other}>
        {children}
      </div>
    );
  }
);

if (config.isDev) {
  PopperTooltip.displayName = 'PopperTooltip';
}

export default PopperTooltip;
