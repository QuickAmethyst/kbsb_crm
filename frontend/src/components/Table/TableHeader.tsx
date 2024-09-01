import { ForwardedRef, forwardRef, ThHTMLAttributes } from 'react';

import classNames from 'classnames';

import theme from '@/utils/theme';

import { useTableControl } from './TableControl';

export type TableHeaderRef = HTMLTableCellElement;
export type TableHeaderProps = ThHTMLAttributes<HTMLTableCellElement>;

function TableHeader(
  { children, className, align = 'left', ...props }: TableHeaderProps,
  ref: ForwardedRef<TableHeaderRef>
) {
  const { stickyHeader } = useTableControl();

  return (
    <th {...props} ref={ref} className={classNames(className, { stickyHeader })} align={align}>
      {children}
      <style jsx>
        {`
          th {
            color: inherit;
            font-size: 14px;
            padding: 10px;
            border-bottom: solid ${theme.color.grey[2]} 1px;
            background-color: ${theme.color.black[4]};
          }

          th.stickyHeader {
            position: sticky;
            top: 0;
            z-index: 2;
          }
        `}
      </style>
    </th>
  );
}

export default forwardRef(TableHeader);
