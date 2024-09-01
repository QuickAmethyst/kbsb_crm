import {
  cloneElement,
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import get from 'lodash.get';
import useForkRef from '@/hooks/useForkRef/useForkRef';

export type ClickAwayMouseEventHandler = 'onClick' | 'onMouseDown' | 'onMouseUp';
export type ClickAwayTouchEventHandler = 'onTouchStart' | 'onTouchEnd';

type ChildrenHandler = (e: SyntheticEvent) => void;

export type ClickAwayListenerProps = {
  /**
   * The wrapped element
   */
  children: ReactNode;
  /**
   * Callback fired when a "click away" event is detected
   */
  onClickAway?: (e: MouseEvent | TouchEvent) => void;
};

export default function ClickAwayListener({ children, onClickAway }: ClickAwayListenerProps) {
  const movedRef = useRef(false);
  const nodeRef = useRef<Element>(null);
  const handleRef = useForkRef((children as unknown as Record<string, never>).ref, nodeRef);
  const syntheticEventRef = useRef(false);

  const handleClickAway = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const insideReactTree = syntheticEventRef.current;
      syntheticEventRef.current = false;

      const doc = nodeRef.current?.ownerDocument || document;

      // Do not act if user performed touchmove
      if (movedRef.current) {
        movedRef.current = false;
        return;
      }

      let insideDOM;
      if (e.composedPath) {
        if (nodeRef.current) {
          insideDOM = e.composedPath().indexOf(nodeRef.current) > -1;
        }
      } else {
        insideDOM =
          !doc.documentElement.contains(e.target as Node) ||
          nodeRef?.current?.contains(e.target as Node);
      }

      if (!insideDOM && !insideReactTree) {
        if (onClickAway) onClickAway(e);
      }
    },
    [onClickAway]
  );

  // Track mouse/touch events that bubbled up through the portal
  const createHandleSynthetic = useCallback(
    (handlerName: string) => (e: SyntheticEvent) => {
      syntheticEventRef.current = true;
      const childrenPropsHandler = get(
        children,
        `props.${handlerName}`
      ) as unknown as ChildrenHandler;

      if (childrenPropsHandler) childrenPropsHandler(e);
    },
    [children]
  );

  useEffect(() => {
    const touchEvent = 'touchend';
    const doc = nodeRef.current?.ownerDocument || document;

    const handleTouchMove = () => {
      movedRef.current = true;
    };

    doc.addEventListener(touchEvent, handleClickAway);
    doc.addEventListener('touchmove', handleTouchMove);

    return () => {
      doc.removeEventListener(touchEvent, handleClickAway);
      doc.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleClickAway]);

  useEffect(() => {
    const mouseEvent = 'click';
    const doc = nodeRef.current?.ownerDocument || document;

    doc.addEventListener(mouseEvent, handleClickAway);

    return () => {
      doc.removeEventListener(mouseEvent, handleClickAway);
    };
  }, [handleClickAway]);

  return cloneElement(children as ReactElement, {
    ref: handleRef,
    onClick: createHandleSynthetic('onClick'),
    onTouchEnd: createHandleSynthetic('onTouchEnd'),
  });
}
