import { cloneElement, forwardRef, isValidElement, useEffect, useState, ReactElement } from 'react';

import get from 'lodash.get';
import { createPortal } from 'react-dom';

import useForkRef from '@/hooks/useForkRef';
import config from '@/utils/config';
import { setRef } from '@/utils/ref';

export type PortalProps = {
  /**
   * An HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container?: ReactElement | (() => ReactElement | null) | null;
  /**
   * The `children` will be under the DOM hierarchy of the parent component.
   * @default false
   */
  disablePortal?: boolean;
  children: ReactElement;
};

function getContainer(container: PortalProps['container']) {
  return typeof container === 'function' ? container() : container;
}

/**
 * Portals provide a first-class way to render children into a DOM node
 * that exists outside the DOM hierarchy of the parent component.
 */
const Portal = forwardRef<ReactElement, PortalProps>(
  ({ children, container, disablePortal = false }, ref) => {
    const [mountNode, setMountNode] = useState<ReactElement | null>(null);
    const handleRef = useForkRef(isValidElement(children) ? get(children, 'ref') : null, ref);

    useEffect(() => {
      if (!disablePortal) {
        setMountNode((getContainer(container) || document.body) as ReactElement);
      }
    }, [container, disablePortal]);

    useEffect(() => {
      if (mountNode && !disablePortal) {
        setRef(ref, mountNode);
        return () => {
          setRef(ref, null);
        };
      }

      return undefined;
    }, [ref, mountNode, disablePortal]);

    if (disablePortal) {
      if (isValidElement(children)) {
        return cloneElement(children as ReactElement, {
          ref: handleRef,
        });
      }
      return children;
    }

    return mountNode ? createPortal(children, mountNode as unknown as Element) : mountNode;
  }
);

if (config.isDev) {
  Portal.displayName = 'Portal';
}

export default Portal;
