import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import classNames from 'classnames';

export type TableContainerRef = HTMLDivElement;
export type TableContainerProps = HTMLAttributes<HTMLDivElement>;

function TableContainer(
  { className, children, ...props }: TableContainerProps,
  ref: ForwardedRef<TableContainerRef>
) {
  return (
    <div {...props} ref={ref} className={classNames('container', className)}>
      {children}
      <style jsx>
        {`
          .container {
            width: 100%;
            padding-bottom: 1px;
            overflow-y: scroll;
          }
        `}
      </style>
    </div>
  );
}

export default forwardRef(TableContainer);
