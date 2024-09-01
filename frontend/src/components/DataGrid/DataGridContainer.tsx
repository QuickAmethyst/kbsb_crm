import {
  CSSProperties,
  ForwardedRef,
  PropsWithChildren,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import Table from '@/components/Table';
import useForkRef from '@/hooks/useForkRef';

import { stickyColumnCN, stickyColumnStyles } from './styles';

export type DataGridContainerInstance = HTMLDivElement;
export type DataGridContainerProps = PropsWithChildren<{
  style?: CSSProperties;
}>;

function DataGridContainer(
  { children, style }: DataGridContainerProps,
  ref: ForwardedRef<DataGridContainerInstance>
) {
  const [scroll, setScroll] = useState({ mostLeft: false, mostRight: false });
  const scrollEl = useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, scrollEl);

  useEffect(() => {
    function eventListener() {
      const mostRightPos =
        (scrollEl.current?.scrollWidth || 0) - (scrollEl.current?.clientWidth || 0);
      const curScrollPos = scrollEl.current?.scrollLeft || 0;
      setScroll({ mostLeft: curScrollPos !== 0, mostRight: curScrollPos !== mostRightPos });
    }

    const el = scrollEl.current;
    el?.addEventListener('scroll', eventListener);

    if (scrollEl.current) {
      scrollEl.current.style.position = 'absolute';
      eventListener();
      scrollEl.current.style.position = '';
    }

    return () => {
      el?.removeEventListener('scroll', eventListener);
    };
  }, []);

  return (
    <Table.Container
      ref={handleRef}
      className={classNames(stickyColumnCN, {
        hasFixLeft: scroll.mostLeft,
        hasFixRight: scroll.mostRight,
      })}
      style={{ ...style, overflowX: 'auto' }}
    >
      {children}
      {stickyColumnStyles}
    </Table.Container>
  );
}

export default forwardRef(DataGridContainer);
